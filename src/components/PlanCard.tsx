import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import type { PlanCardProps } from "@/lib/types";



export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  return (
    <Card className={`relative transition-all duration-200 ${
      isSelected 
        ? 'ring-2 ring-white shadow-lg bg-purple-500 text-white' 
        : 'hover:shadow-md'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="mb-2 text-xl font-bold text-purple-900">{plan.name}</h3>
          <div className="mb-4">
            <span className="text-2xl">{plan.price}</span>
            <span className="text-muted-foreground">/{plan.period}</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                feature.included 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                <Check className="w-3 h-3" />
              </div>
              <span className={`text-sm ${
                feature.included ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={() => onSelect(plan.id)}
          variant={isSelected ? "default" : "outline"}
          className={isSelected ? "bg-white text-purple-500 w-full" : "text-purple-600 bg-white w-full"}
        >
          {isSelected ? "Selected" : "Choose This"}
        </Button>
      </CardContent>
    </Card>
  );
}