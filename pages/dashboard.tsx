
import { useState } from 'react'
import Layout from '../components/Layout'
import CandidateCard, { Candidate } from '../components/CandidateCard'

const mock: Candidate[] = [
  { id: '1', name: 'Ada Lovelace', score: 92, role: 'Backend Engineer' },
  { id: '2', name: 'Alan Turing', score: 88, role: 'ML Engineer' },
  { id: '3', name: 'Grace Hopper', score: 85, role: 'DevOps' },
]

export default function Dashboard() {
  const [candidates] = useState(mock)

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Candidate Dashboard</h1>
      <div className="grid gap-4">
        {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
      </div>
    </Layout>
  )
}
