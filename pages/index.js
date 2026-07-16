import { useState, useEffect } from 'react'
import Head from 'next/head'
import EventCard from '../components/EventCard'
import PurchaseModal from '../components/PurchaseModal'
import TicketModal from '../components/TicketModal'

export default function Home() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [purchasedTicket, setPurchasedTicket] = useState(null)

  const loadEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
  }

  useEffect(() => { loadEvents() }, [])

  return (
    <>
      <Head><title>EventTick - Browse Events</title></Head>
      <nav className="navbar">
        <div className="logo">🎟️ EventTick</div>
        <div className="nav-links">
          <a href="/" className="btn-outline">Events</a>
          <a href="/admin" className="btn-solid">Admin Panel</a>
        </div>
      </nav>
      <div className="container">
        <div className="page-header">
          <h1>Discover Amazing Events</h1>
          <p>Browse events, get your ticket, and check in with a simple QR scan</p>
        </div>
        <div className="events-grid">
          {events.map(ev => (
            <EventCard key={ev.id} event={ev} onBuy={() => setSelectedEvent(ev)} />
          ))}
        </div>
      </div>
      {selectedEvent && (
        <PurchaseModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onPurchase={(ticket) => { setSelectedEvent(null); setPurchasedTicket(ticket); }}
        />
      )}
      {purchasedTicket && (
        <TicketModal ticket={purchasedTicket} onClose={() => setPurchasedTicket(null)} />
      )}
    </>
  )
}
