import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

export default function JoinPage() {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [shareCode]);

  const fetchSession = async () => {
    try {
      const response = await axios.get(API + "/sessions/" + shareCode);
      const data = response.data.data;
      setSession(data);

      const partnerRole = data.created_by === "bride" ? "groom" : "bride";
      const isCompleted =
        partnerRole === "bride" ? data.bride_completed : data.groom_completed;

      if (isCompleted) {
        toast.info("You've already completed your book!");
        navigate("/results/" + shareCode);
      }
    } catch (error) {
      console.error(error);
      toast.error("Session not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    const partnerRole = session.created_by === "bride" ? "groom" : "bride";
    navigate("/quiz/" + shareCode + "?role=" + partnerRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p
            className="text-[#5C5C5C]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Finding your partner's book...
          </p>
        </div>
      </div>
    );
  }

  const partnerRole = session?.created_by === "bride" ? "groom" : "bride";
  const creatorTitle = session?.created_by === "bride" ? "Bride" : "Groom";
  const roleColor = partnerRole === "bride" ? "#C98A83" : "#7B96AB";
  const roleBg = partnerRole === "bride" ? "#FDF7F6" : "#F5F7F9";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: roleBg }}
    >
      <div className="max-w-md w-full text-center">
        <div className="animate-fade-in-up">
          <p
            className="text-xs uppercase tracking-[0.3em] text-[#5C5C5C] mb-4"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            You've Been Invited
          </p>

          <h1
            className="text-4xl sm:text-5xl text-[#1A1A1A] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            data-testid="join-title"
          >
            {session?.partner_name}'s
            <br />
            Slam Book
          </h1>

          <p
            className="text-base text-[#5C5C5C] mb-8 leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}
          >
            Your {creatorTitle.toLowerCase()} has completed their book and is
            waiting for you to fill out yours. Answer the questions about
            yourself, then guess their answers!
          </p>

          <div
            className="inline-block px-6 py-3 rounded-full mb-8"
            style={{ backgroundColor: roleColor + "20" }}
          >
            <span
              className="text-sm uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Outfit', sans-serif", color: roleColor }}
              data-testid="role-indicator"
            >
              You are the {partnerRole}
            </span>
          </div>

          <Button
            onClick={startQuiz}
            className="w-full py-6 text-white uppercase tracking-[0.15em] text-sm transition-all hover:-translate-y-1"
            style={{ backgroundColor: roleColor }}
            data-testid="start-partner-quiz-button"
          >
            Start My Book
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p
            className="mt-8 text-xs text-[#5C5C5C]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Share Code:{" "}
            <span className="font-medium tracking-wider">{shareCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
