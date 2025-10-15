import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  link: string;
  locked?: boolean;
}

const CategoryCard = ({
  title,
  description,
  icon: Icon,
  image,
  link,
  locked = false,
}: CategoryCardProps) => {
  const CardContent = (
    <Card className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
        
        {locked && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-card/95 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-secondary/95 backdrop-blur-sm rounded-lg px-4 py-3 inline-flex items-center gap-3 shadow-md">
            <Icon className="h-5 w-5 text-secondary-foreground" />
            <span className="font-bold text-secondary-foreground text-sm uppercase tracking-wide">
              {title}
            </span>
          </div>
        </div>
      </div>

      {description && (
        <div className="p-4 bg-card">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
    </Card>
  );

  if (locked) {
    return <div className="opacity-75 cursor-not-allowed">{CardContent}</div>;
  }

  return (
    <Link to={link} className="block h-full">
      {CardContent}
    </Link>
  );
};

export default CategoryCard;
