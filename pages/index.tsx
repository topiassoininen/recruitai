
import Head from 'next/head'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <Head><title>RecruitAI – Home</title></Head>
      <section className="max-w-xl">
        <h1 className="text-3xl font-semibold mb-4">Async interviews that hire better, faster.</h1>
        <p className="mb-6 text-lg">Stop burning founder hours screening résumés. Let our AI rank candidates, run unbiased interviews and surface the gems.</p>
        <Link href="/dashboard" className="inline-flex items-center px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">View Demo</Link>
      </section>
    </Layout>
  )
}
