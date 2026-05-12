import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export interface HoverCardData {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  color?: string;
  bgGradient?: string;
  stats: {
    label: string;
    value: string;
  }[];
  tags: string[];
}

interface InteractiveCardProps {
  data: HoverCardData;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ data }) => {
  return (
    <Card className="relative h-full overflow-hidden border border-border bg-card hover:bg-accent/10 hover:border-primary/50 transition-colors shadow-sm group">
      <CardHeader className="relative z-10 pb-4">
        {data.image && (
          <div className="absolute inset-0 -z-10">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
        )}
        <div className="flex items-start justify-between">
          {data.icon && (
            <div className={`p-3 rounded-md bg-muted border border-border ${data.color}`}>
              {data.icon}
            </div>
          )}
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
            <Eye className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="mt-4 text-xl font-bold">
          {data.title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {data.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((stat, index) => (
            <div
              key={index}
              className="p-3 rounded-md bg-muted/50 border border-border"
            >
              <div className="text-xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-secondary hover:bg-secondary border-transparent"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Button asChild className="w-full group/btn" variant="default">
            <Link to="/discover" search={{ q: data.title }}>
              <span>Learn More</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const InteractiveHoverCards: React.FC<{ cards: HoverCardData[] }> = ({ cards }) => {
  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <InteractiveCard key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
};

export default InteractiveHoverCards;
