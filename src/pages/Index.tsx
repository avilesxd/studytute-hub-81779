import CategoryCard from "@/components/CategoryCard";
import { Users, GraduationCap, Calendar, FileText, CreditCard, BookOpen } from "lucide-react";
import mathTutoringImage from "@/assets/math-tutoring.jpg";
import physicsTutoringImage from "@/assets/physics-tutoring.jpg";
import programmingTutoringImage from "@/assets/programming-tutoring.jpg";

const Index = () => {
  const categories = [
    {
      title: "Tutoría Entre Estudiantes",
      description: "Encuentra apoyo académico o comparte tu conocimiento con otros estudiantes",
      icon: Users,
      image: mathTutoringImage,
      link: "/tutorias",
      locked: false,
    },
    {
      title: "Evaluación Docente",
      description: "Evalúa a tus docentes y contribuye a mejorar la calidad educativa",
      icon: GraduationCap,
      image: physicsTutoringImage,
      link: "#",
      locked: true,
    },
    {
      title: "Inscripción de Asignaturas",
      description: "Inscribe tus asignaturas para el próximo semestre académico",
      icon: BookOpen,
      image: programmingTutoringImage,
      link: "#",
      locked: true,
    },
    {
      title: "Solicitudes Académicas",
      description: "Gestiona tus solicitudes académicas y trámites administrativos",
      icon: FileText,
      image: mathTutoringImage,
      link: "#",
      locked: true,
    },
    {
      title: "Pago en Línea",
      description: "Realiza tus pagos de matrícula y aranceles de forma segura",
      icon: CreditCard,
      image: physicsTutoringImage,
      link: "#",
      locked: true,
    },
    {
      title: "Horario Semanal",
      description: "Consulta tu horario de clases y actividades académicas",
      icon: Calendar,
      image: programmingTutoringImage,
      link: "#",
      locked: true,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Inicio</h1>
        <p className="text-muted-foreground text-lg">
          Bienvenido a tu portal estudiantil de Universidad Arica
        </p>
      </div>

      <div className="mb-6">
        <button className="text-accent hover:text-accent/80 transition-colors font-medium flex items-center gap-2">
          VER TODAS LAS TARJETAS
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </>
  );
};

export default Index;
