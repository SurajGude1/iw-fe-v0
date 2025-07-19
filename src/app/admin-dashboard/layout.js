import LeftNavBar from "./components/LeftNavBar";
import TopBar from "./components/TopBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="Height100vh Box100w FlexBoxColumn JustifyCenter PositionFixed">
      <TopBar />
      <div className="Box100wh FlexBoxRow JustifyCenter">
        <LeftNavBar />
        <div className="BoxW82H100 PositionRelative OverflowAuto">
          {children}
        </div>
      </div>
    </div>
  );
}
