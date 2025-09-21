"use client";
import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function TeacherHomePage() {
  const courses = 1;
  const lessons = 3;
  const students = 42;

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventDesc, setEventDesc] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDesc, setEditDesc] = useState("");

  // When a slot is selected, open modal to add event
  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setEventDesc("");
    setShowModal(true);
  };

  // Add event to calendar
  const handleAddEvent = () => {
    if (eventDesc.trim() && selectedSlot) {
      setEvents([
        ...events,
        {
          title: eventDesc,
          start: selectedSlot.start,
          end: selectedSlot.end,
          allDay: false,
        },
      ]);
      setShowModal(false);
      setSelectedSlot(null);
      setEventDesc("");
    }
  };

  // When an event is clicked, show its details
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditDesc(event.title);
    setShowEventModal(true);
    setEditMode(false);
  };

  // Delete event
  const handleDeleteEvent = () => {
    setEvents(events.filter(ev => ev !== selectedEvent));
    setShowEventModal(false);
    setSelectedEvent(null);
    setEditMode(false);
  };

  // Edit event
  const handleEditEvent = () => {
    setEditMode(true);
  };

  // Save edited event
  const handleSaveEditEvent = () => {
    setEvents(events.map(ev =>
      ev === selectedEvent ? { ...ev, title: editDesc } : ev
    ));
    setSelectedEvent({ ...selectedEvent, title: editDesc });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-300"
         style={{ marginLeft: '4rem' }}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Welcome, Aadi Kapoor!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <span className="text-2xl font-semibold text-green-700">{courses}</span>
            <span className="mt-2 text-gray-600">Courses</span>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <span className="text-2xl font-semibold text-green-700">{lessons}</span>
            <span className="mt-2 text-gray-600">Lessons</span>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <span className="text-2xl font-semibold text-green-700">{students}</span>
            <span className="mt-2 text-gray-600">Students</span>
          </div>
        </div>
        {/* Weekly Calendar */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Weekly Calendar</h2>
          <Calendar
            localizer={localizer}
            events={events}
            defaultView="week"
            views={["week"]}
            style={{ height: 500, width: "100%" }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            step={60}
            timeslots={1}
          />
        </div>
        {/* Modal for adding event */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Add Calendar Event</h2>
              <p className="mb-2">
                <strong>
                  {selectedSlot &&
                    `${format(selectedSlot.start, "eeee, MMM d, h a")} - ${format(selectedSlot.end, "h a")}`}
                </strong>
              </p>
              <input
                className="border p-2 mb-4 w-full"
                placeholder="Description of what you want to complete"
                value={eventDesc}
                onChange={e => setEventDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleAddEvent}
                >
                  Add
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal for viewing/editing/deleting event details */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Event Details</h2>
              <p className="mb-2">
                <strong>
                  {format(selectedEvent.start, "eeee, MMM d, h a")} - {format(selectedEvent.end, "h a")}
                </strong>
              </p>
              {editMode ? (
                <input
                  className="border p-2 mb-4 w-full"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                />
              ) : (
                <p className="mb-4">{selectedEvent.title}</p>
              )}
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      onClick={handleSaveEditEvent}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                      onClick={handleEditEvent}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={handleDeleteEvent}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={() => setShowEventModal(false)}
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}