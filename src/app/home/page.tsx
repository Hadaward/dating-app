import NavigationBar from "@/components/NavigationBar";
import UserCard from "@/components/UserCard";
import { Add, Notifications, Search, Tune } from "@mui/icons-material";

export default function Home() {
    return (
      <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        {/* Top Navigation Bar */}
        <div className="w-full h-16 p-6 flex items-center justify-between">
          <div className="flex justify-center items-center gap-2">
            <div 
              className="bg-[linear-gradient(150.7deg,#F64A69_26.19%,#EF3349_72.96%)] p-1 rounded-full"
              style={{
                boxShadow: 'inset -9.87px -9.87px 17.76px 0px #B5101C, 9.54px 6.82px 19.64px 0px #31141B'
              }}
            >
              <Add className="text-white" />
            </div>
            <span
              className="text-center font-lexend font-semibold text-white text-lg"
            >
              Add Story
            </span>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button>
              <Search className="text-white" />
            </button>
            <button>
              <Notifications className="text-white" />
            </button>
            <button>
              <Tune className="text-white" />
            </button>
          </div>
        </div>
        <section className="w-full h-full p-6 flex items-center justify-center">
          <UserCard name="Anna Mckskakasasad" photoURL="/file.svg" />
        </section>
        <NavigationBar />
      </main>
    )
}