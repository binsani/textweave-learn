import { Quiz } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, RefreshCw, ArrowRight, CheckCircle2, XCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  onRetry: () => void;
  onReview: () => void;
  onContinue: () => void;
}

export function QuizResults({
  quiz,
  score,
  totalPoints,
  correctCount,
  totalQuestions,
  passed,
  onRetry,
  onReview,
  onContinue,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalPoints) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Result Header */}
      <div className="text-center space-y-4">
        <div
          className={cn(
            'w-20 h-20 rounded-full mx-auto flex items-center justify-center',
            passed ? 'bg-success/10' : 'bg-destructive/10'
          )}
        >
          {passed ? (
            <Trophy className="h-10 w-10 text-success" />
          ) : (
            <Target className="h-10 w-10 text-destructive" />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-serif font-semibold mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing'}
          </h2>
          <p className="text-muted-foreground">
            {passed
              ? 'You have successfully passed this quiz.'
              : `You need ${quiz.passingScore}% to pass. Try again!`}
          </p>
        </div>
      </div>

      {/* Score Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Main Score */}
          <div className="text-center">
            <div className="text-5xl font-bold font-serif mb-2">
              {percentage}%
            </div>
            <p className="text-sm text-muted-foreground">
              {score} out of {totalPoints} points
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Score</span>
              <span>Passing: {quiz.passingScore}%</span>
            </div>
            <div className="relative">
              <Progress value={percentage} className="h-3" />
              <div
                className="absolute top-0 h-3 w-0.5 bg-foreground/50"
                style={{ left: `${quiz.passingScore}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-success mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xl font-semibold">{correctCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-destructive mb-1">
                <XCircle className="h-4 w-4" />
                <span className="text-xl font-semibold">{totalQuestions - correctCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-muted-foreground mb-1">
                {totalQuestions}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex-1 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button
          variant="outline"
          onClick={onReview}
          className="flex-1"
        >
          Review Answers
        </Button>
        {passed && (
          <Button
            onClick={onContinue}
            className="flex-1 gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
