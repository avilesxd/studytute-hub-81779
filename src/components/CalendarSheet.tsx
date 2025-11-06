import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface CalendarEntry {
  tutoring_id: string;
  tutoring_name: string;
  tutoring_date: string;
  role: "tutor" | "student";
}

export const CalendarSheet = () => {
  const [events, setEvents] = useState<CalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchCalendar = async () => {
        const { data, error } = await supabase.rpc("get_user_calendar", {
          p_user_id: user.id,
        });

        if (error) {
          console.error("Error fetching calendar:", error);
        } else {
          setEvents(data || []);
        }
      };

      fetchCalendar();
    }
  }, [user]);

  const eventsOnSelectedDate = events.filter((event) => {
    if (!selectedDate) return false;
    const eventDate = new Date(event.tutoring_date);
    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
        >
          <CalendarIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Calendario de Tutorías</SheetTitle>
        </SheetHeader>
        <div className="py-8">
          <Calendar
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              event: events.map((event) => new Date(event.tutoring_date)),
            }}
            modifiersClassNames={{
              event: "bg-primary text-primary-foreground",
            }}
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Eventos para {selectedDate?.toLocaleDateString()}
            </h3>
            {eventsOnSelectedDate.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {eventsOnSelectedDate.map((event) => (
                  <li key={event.tutoring_id} className="p-2 rounded-md">
                    <p className="font-semibold">{event.tutoring_name}</p>
                    <p
                      className={`text-sm ${
                        event.role === "tutor"
                          ? "text-blue-500"
                          : "text-green-500"
                      }`}
                    >
                      {event.role === "tutor"
                        ? "Tutoría que impartes"
                        : "Tutoría a la que asistes"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-2">
                No hay eventos para esta fecha.
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
