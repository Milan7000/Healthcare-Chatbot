"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import type { Message, HealthCenter } from "@/lib/types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { handleSymptomSubmission, handleReportGeneration, handleImageAnalysis } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { HealthCenterCard } from "./HealthCenterCard";
import { useToast } from "@/hooks/use-toast";
import type { GenerateHealthReportInput } from "@/ai/flows/generate-health-report";
import Header from "@/components/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin } from "lucide-react";

const placeholderHealthCenters: HealthCenter[] = [
    { name: "Community Health Clinic", address: "123 Village Road, Rural District", phone: "+1234567890" },
    { name: "Sunrise Medical Center", address: "456 Town Square, Near City", phone: "+0987654321" },
];

export default function ChatWindow() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const [diagnosisContext, setDiagnosisContext] = useState<GenerateHealthReportInput | null>(null);
  const [language, setLanguage] = useState("english");
  const [location, setLocation] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage: Message = {
      id: "0",
      role: "assistant",
      content: "Welcome to Seva Health AI. I'm here to help you with a preliminary health assessment. Please describe your symptoms in detail.",
    };
    const locationMessage: Message = {
        id: 'location-prompt',
        role: 'assistant',
        content: (
            <div>
                <p>To provide localized health center recommendations, please share your location.</p>
                <Button className="mt-2" onClick={requestLocation}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Share Location
                </Button>
            </div>
        )
    };
    setMessages([initialMessage, locationMessage]);
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const addMessage = (role: "user" | "assistant" | "system", content: React.ReactNode, diagnosis?: Message['diagnosis']) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role, content, diagnosis }]);
  };
  
  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude}, ${longitude}`);
        addMessage("system", `Location shared: ${latitude}, ${longitude}`);
        toast({ title: "Location Shared", description: "Thank you for sharing your location." });
      },
      (error) => {
        console.error("Geolocation error:", error);
        addMessage("system", "User did not share location.");
        toast({
          title: "Location Access Denied",
          description: "You can still use the app, but health center recommendations will not be localized.",
          variant: "destructive",
        });
      }
    );
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    addMessage("system", `Language changed to ${newLanguage}.`);
  }
  
  const handleSubmit = (input: string) => {
    addMessage("user", input);
    setDiagnosisContext(null);

    startTransition(async () => {
      const result = await handleSymptomSubmission(input, language);

      if ("error" in result) {
        addMessage("assistant", `Error: ${result.error}`);
        toast({
          title: "An error occurred",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      
      const diagnosisData = {
        symptoms: input,
        diagnosis: result.diagnosis,
        confidenceLevel: result.confidenceLevel,
        urgencyAlert: result.urgencyAlert,
      };

      const diagnosisMessage = (
        <div>
          <p className="font-semibold">Preliminary Diagnosis:</p>
          <p><span className="font-medium">Condition:</span> {result.diagnosis}</p>
          <p><span className="font-medium">Confidence:</span> {(result.confidenceLevel * 100).toFixed(0)}%</p>
          <p className="mt-2 px-3 py-1 rounded-full bg-destructive/20 text-destructive-foreground font-bold">{result.urgencyAlert}</p>
        </div>
      );

      addMessage("assistant", diagnosisMessage, diagnosisData);
      
      let riskLevel = "Low";
      if (result.urgencyAlert.toLowerCase().includes("immediate")) {
        riskLevel = "High";
      } else if (result.confidenceLevel < 0.6) {
        riskLevel = "Medium";
      }
      
      const reportContext: GenerateHealthReportInput = {
        symptoms: input,
        diagnosis: result.diagnosis,
        riskLevel: riskLevel,
        recommendation: result.urgencyAlert
      };
      setDiagnosisContext(reportContext);

      addMessage("assistant", 
        <div>
          <p>Would you like a detailed health report?</p>
          <Button 
            className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => generateReport(reportContext)}
            disabled={isPending}
          >
            Generate Health Report
          </Button>
        </div>
      );
      
      if (riskLevel === "High") {
        addMessage("assistant", 
            <div>
                <p className="font-semibold mb-2">Please seek medical attention. {location ? "Here are some nearby centers:" : "Here are some example centers:"}</p>
                <div className="space-y-2">
                    {placeholderHealthCenters.map((center, index) => (
                        <HealthCenterCard key={index} center={center} />
                    ))}
                </div>
            </div>
        );
      }
    });
  };

  const handleFileUpload = (file: File) => {
    addMessage("user", `Uploaded image: ${file.name}`);
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoDataUri = e.target?.result as string;
      startTransition(async () => {
        const result = await handleImageAnalysis(photoDataUri, language);

        if ("error" in result) {
            addMessage("assistant", `Error analyzing image: ${result.error}`);
            toast({
              title: "Image Analysis Failed",
              description: result.error,
              variant: "destructive",
            });
        } else {
            addMessage("assistant", 
              <div>
                <h3 className="text-lg font-bold mb-2">Image Analysis</h3>
                <p className="whitespace-pre-wrap">{result.analysis}</p>
              </div>
            );
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const generateReport = (context: GenerateHealthReportInput) => {
    startTransition(async () => {
        addMessage("system", "Generating your health report...");
        const result = await handleReportGeneration(context);
        
        setMessages(prev => prev.filter(m => m.id !== 'thinking' && m.content !== "Generating your health report..."));

        if ("error" in result) {
            addMessage("assistant", `Error generating report: ${result.error}`);
            toast({
              title: "Report Generation Failed",
              description: result.error,
              variant: "destructive",
            });
        } else {
            addMessage("assistant", 
              <div>
                <h3 className="text-lg font-bold mb-2">Your Health Report</h3>
                <p className="whitespace-pre-wrap">{result.report}</p>
              </div>
            );
        }
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isPending && (
            <ChatMessage
              message={{
                id: "thinking",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
        </div>
        <div className="p-4 border-t bg-background">
          <ChatInput 
            onSubmit={handleSubmit} 
            onFileUpload={handleFileUpload}
            disabled={isPending} 
          />
        </div>
      </main>
    </div>
  );
}
