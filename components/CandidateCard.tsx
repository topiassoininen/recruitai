
import {PlayCircle} from 'lucide-react';

export interface Candidate {
  id: string;
  name: string;
  score: number;
  role: string;
}

export default function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition">
      <div>
        <h3 className="text-lg font-medium">{candidate.name}</h3>
        <p className="text-sm text-gray-500">{candidate.role}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-semibold">{candidate.score}%</span>
        <PlayCircle className="w-6 h-6 text-indigo-600 hover:text-indigo-700 cursor-pointer" />
      </div>
    </div>
  )
}
