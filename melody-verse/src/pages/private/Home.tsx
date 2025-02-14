import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function Home() {
  const user = useSelector((state:RootState)=>state.user)
    
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Welcome {user.email} to MelodyVerse</h1>
        <p className="text-gray-600">Your musical journey begins here!</p>
      </div>
    </div>
  );
}