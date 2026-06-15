import prisma from '../config/db.js';

// Get test by category (Student view - hides correct answers)
export const getTestByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    const test = await prisma.test.findUnique({
      where: { category },
      include: {
        questions: {
          select: {
            id: true,
            type: true,
            questionText: true,
            options: true
          }
        }
      }
    });

    if (!test) {
      return res.status(200).json({ test: null, submission: null });
    }

    const submission = await prisma.testSubmission.findUnique({
      where: {
        userId_testId: {
          userId,
          testId: test.id
        }
      }
    });

    return res.status(200).json({ test, submission });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving test' });
  }
};

// Student submit test answers
export const submitTest = async (req, res) => {
  try {
    const { category } = req.params;
    const { answers } = req.body; // Map: { [questionId]: answerStringOrIndex }
    const userId = req.user.id;

    if (!answers) {
      return res.status(400).json({ error: 'Please provide answers' });
    }

    const test = await prisma.test.findUnique({
      where: { category },
      include: { questions: true }
    });

    if (!test) {
      return res.status(404).json({ error: 'Test not found for this category' });
    }

    const hasShortAnswer = test.questions.some(q => q.type === 'SHORT');
    let totalQuestions = test.questions.length;
    let mcqCorrect = 0;
    let mcqCount = 0;

    test.questions.forEach(q => {
      if (q.type === 'MCQ') {
        mcqCount++;
        const userAnswer = answers[q.id];
        if (userAnswer && String(userAnswer).trim() === String(q.correctOption).trim()) {
          mcqCorrect++;
        }
      }
    });

    let score = mcqCorrect;
    let passed = false;
    let status = 'pending';

    if (!hasShortAnswer) {
      // Auto grade MCQ only tests
      const percentage = mcqCount > 0 ? (mcqCorrect / mcqCount) * 100 : 100;
      score = Math.round(percentage);
      passed = score >= 70; // 70% passing threshold
      status = 'graded';
    }

    const submission = await prisma.testSubmission.upsert({
      where: {
        userId_testId: {
          userId,
          testId: test.id
        }
      },
      update: {
        answers: JSON.stringify(answers),
        score,
        passed,
        status,
        feedback: null,
        gradedAt: null
      },
      create: {
        userId,
        testId: test.id,
        answers: JSON.stringify(answers),
        score,
        passed,
        status
      }
    });

    return res.status(200).json({ submission, hasShortAnswer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error submitting test' });
  }
};

// Get all tests for configuration (Admin only)
export const adminGetTests = async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      include: { questions: true }
    });
    return res.status(200).json(tests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error fetching tests' });
  }
};

// Create or update a test and questions (Admin only)
export const adminUpsertTest = async (req, res) => {
  try {
    const { category, questions } = req.body;

    if (!category) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const test = await prisma.$transaction(async (tx) => {
      let t = await tx.test.findUnique({ where: { category } });
      if (!t) {
        t = await tx.test.create({ data: { category } });
      }

      // Clear old questions
      await tx.question.deleteMany({ where: { testId: t.id } });

      // Create new questions
      if (questions && questions.length > 0) {
        await tx.question.createMany({
          data: questions.map(q => ({
            testId: t.id,
            type: q.type,
            questionText: q.questionText,
            options: q.options || '',
            correctOption: q.correctOption || ''
          }))
        });
      }

      return tx.test.findUnique({
        where: { id: t.id },
        include: { questions: true }
      });
    });

    return res.status(200).json(test);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error configuring test' });
  }
};

// Get all student submissions (Admin only)
export const adminGetSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.testSubmission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        test: {
          include: {
            questions: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving submissions' });
  }
};

// Grade student submission (Admin only)
export const adminGradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, passed, feedback } = req.body;

    const submissionId = parseInt(id);
    if (isNaN(submissionId)) {
      return res.status(400).json({ error: 'Invalid submission ID' });
    }

    const updated = await prisma.testSubmission.update({
      where: { id: submissionId },
      data: {
        score: parseInt(score),
        passed: Boolean(passed),
        feedback,
        status: 'graded',
        gradedAt: new Date()
      }
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error grading submission' });
  }
};
