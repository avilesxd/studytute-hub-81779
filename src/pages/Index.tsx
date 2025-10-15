import Header from "@/components/Header";
import TutoringCard from "@/components/TutoringCard";
import BecomeATutorDialog from "@/components/BecomeATutorDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import mathTutoringImage from "@/assets/math-tutoring.jpg";
import physicsTutoringImage from "@/assets/physics-tutoring.jpg";
import programmingTutoringImage from "@/assets/programming-tutoring.jpg";

const Index = () => {
  const tutoringData = [
    {
      id: 1,
      title: "Cálculo Diferencial e Integral",
      tutor: "María González",
      schedule: "Lunes y Miércoles 15:00-17:00",
      room: "205",
      availableSpots: 5,
      totalSpots: 10,
      price: 3000,
      materials: ["Calculadora científica", "Cuaderno", "Lápiz"],
      topics: ["Derivadas", "Integrales", "Límites", "Series"],
      rating: 5,
      image: mathTutoringImage,
    },
    {
      id: 2,
      title: "Física General y Mecánica",
      tutor: "Carlos Rodríguez",
      schedule: "Martes y Jueves 16:00-18:00",
      room: "308",
      availableSpots: 8,
      totalSpots: 12,
      price: 3500,
      materials: ["Calculadora", "Formularios", "Guías de ejercicios"],
      topics: ["Cinemática", "Dinámica", "Trabajo y energía", "Momento"],
      rating: 4,
      image: physicsTutoringImage,
    },
    {
      id: 3,
      title: "Programación en Python",
      tutor: "Ana Martínez",
      schedule: "Viernes 14:00-17:00",
      room: "405",
      availableSpots: 3,
      totalSpots: 8,
      price: 4000,
      materials: ["Laptop", "Python instalado", "Editor de código"],
      topics: ["Sintaxis básica", "Estructuras de datos", "POO", "Algoritmos"],
      rating: 5,
      image: programmingTutoringImage,
    },
    {
      id: 4,
      title: "Química Orgánica",
      tutor: "Pedro Silva",
      schedule: "Miércoles y Viernes 10:00-12:00",
      room: "508",
      availableSpots: 6,
      totalSpots: 10,
      price: 3200,
      materials: ["Tabla periódica", "Modelo molecular", "Cuaderno"],
      topics: ["Hidrocarburos", "Grupos funcionales", "Reacciones", "Nomenclatura"],
      rating: 4,
      image: physicsTutoringImage,
    },
    {
      id: 5,
      title: "Álgebra Lineal",
      tutor: "Laura Fernández",
      schedule: "Lunes 18:00-20:00",
      room: "302",
      availableSpots: 7,
      totalSpots: 15,
      price: 2500,
      materials: ["Calculadora", "Formularios", "Apuntes"],
      topics: ["Matrices", "Determinantes", "Vectores", "Sistemas lineales"],
      rating: 5,
      image: mathTutoringImage,
    },
    {
      id: 6,
      title: "Inglés Avanzado",
      tutor: "John Smith",
      schedule: "Sábados 09:00-11:00",
      room: "401",
      availableSpots: 4,
      totalSpots: 8,
      price: 4500,
      materials: ["Libro de texto", "Diccionario", "Audífonos"],
      topics: ["Gramática avanzada", "Conversación", "Writing", "Listening"],
      rating: 5,
      image: programmingTutoringImage,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">
                Tutoría Entre Estudiantes
              </h1>
              <p className="text-muted-foreground text-lg">
                Encuentra el apoyo académico que necesitas o comparte tu conocimiento
              </p>
            </div>
            <BecomeATutorDialog />
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar tutorías por tema, materia o tutor..."
              className="pl-10 bg-card shadow-sm border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutoringData.map((tutoring) => (
            <TutoringCard key={tutoring.id} {...tutoring} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
