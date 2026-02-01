import FaultReportForm from '@/components/FaultReportForm'
import './page.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="container">
        <div className="home-header">
          <h1>Arıza Bildir</h1>
          <p>Haritadan konumunuzu seçin ve arıza bildirin</p>
        </div>
        <FaultReportForm />
      </div>
    </div>
  )
}
