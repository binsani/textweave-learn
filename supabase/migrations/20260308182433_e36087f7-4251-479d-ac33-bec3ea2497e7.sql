
-- 1. Create grade_quiz server-side function (protects correct_answer from client exposure)
CREATE OR REPLACE FUNCTION public.grade_quiz(
  p_quiz_id uuid,
  p_answers jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer := 0;
  v_total_points integer := 0;
  v_correct_count integer := 0;
  v_total_questions integer := 0;
  v_passing_score integer;
  v_percentage numeric;
  v_passed boolean;
  v_question_results jsonb := '[]'::jsonb;
  v_question record;
  v_user_answer text;
  v_is_correct boolean;
  v_course_id uuid;
  v_lesson_id uuid;
BEGIN
  -- Get quiz info
  SELECT passing_score, lesson_id INTO v_passing_score, v_lesson_id
  FROM quizzes WHERE id = p_quiz_id;
  IF v_passing_score IS NULL THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;

  -- Verify enrollment
  v_course_id := get_course_id_from_lesson(v_lesson_id);
  IF NOT is_enrolled(auth.uid(), v_course_id)
     AND NOT is_course_instructor(auth.uid(), v_course_id)
     AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Not authorized to take this quiz';
  END IF;

  -- Grade each question
  FOR v_question IN
    SELECT id, correct_answer, explanation, points
    FROM questions
    WHERE quiz_id = p_quiz_id
    ORDER BY "order"
  LOOP
    v_total_questions := v_total_questions + 1;
    v_total_points := v_total_points + v_question.points;
    v_user_answer := p_answers->>v_question.id::text;
    v_is_correct := (v_user_answer IS NOT NULL AND v_user_answer = v_question.correct_answer);

    IF v_is_correct THEN
      v_score := v_score + v_question.points;
      v_correct_count := v_correct_count + 1;
    END IF;

    v_question_results := v_question_results || jsonb_build_object(
      'questionId', v_question.id,
      'correctAnswer', v_question.correct_answer,
      'explanation', v_question.explanation,
      'isCorrect', v_is_correct,
      'userAnswer', v_user_answer,
      'points', v_question.points
    );
  END LOOP;

  v_percentage := CASE WHEN v_total_points > 0 THEN (v_score::numeric / v_total_points * 100) ELSE 0 END;
  v_passed := v_percentage >= v_passing_score;

  -- Record the attempt
  INSERT INTO quiz_attempts (quiz_id, user_id, answers, score, passed, completed_at)
  VALUES (p_quiz_id, auth.uid(), p_answers, v_score, v_passed, now());

  RETURN jsonb_build_object(
    'score', v_score,
    'totalPoints', v_total_points,
    'correctCount', v_correct_count,
    'totalQuestions', v_total_questions,
    'percentage', round(v_percentage),
    'passed', v_passed,
    'passingScore', v_passing_score,
    'questionResults', v_question_results
  );
END;
$$;
