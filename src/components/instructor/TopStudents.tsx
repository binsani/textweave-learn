import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopStudent {
  id: string;
  name: string;
  avatar?: string;
  coursesCompleted: number;
  totalProgress: number;
  quizAverage: number;
  rank: number;
}

const mockTopStudents: TopStudent[] = [
  {
    id: '1',
    name: 'Emma Wilson',
    coursesCompleted: 4,
    totalProgress: 98,
    quizAverage: 96,
    rank: 1,
  },
  {
    id: '2',
    name: 'James Lee',
    coursesCompleted: 3,
    totalProgress: 92,
    quizAverage: 94,
    rank: 2,
  },
  {
    id: '3',
    name: 'Sarah Chen',
    coursesCompleted: 3,
    totalProgress: 88,
    quizAverage: 91,
    rank: 3,
  },
  {
    id: '4',
    name: 'Michael Brown',
    coursesCompleted: 2,
    totalProgress: 85,
    quizAverage: 89,
    rank: 4,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    coursesCompleted: 2,
    totalProgress: 79,
    quizAverage: 87,
    rank: 5,
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />;
    default:
      return (
        <span className="h-4 w-4 flex items-center justify-center text-xs font-bold text-muted-foreground">
          {rank}
        </span>
      );
  }
};

export function TopStudents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Top Students</CardTitle>
        <p className="text-sm text-muted-foreground">
          Highest performing learners across your courses
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTopStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6">
                {getRankIcon(student.rank)}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{student.name}</p>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {student.quizAverage}% avg
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={student.totalProgress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground shrink-0">
                    {student.coursesCompleted} courses
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
