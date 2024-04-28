import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainScreen from "./components/layout/MainScreen";
import Navigation from "./components/layout/Navigation";

function App() {
  return (
    <div>
      <Header/>
      <div className="main-screen-wrapper">
        <Navigation/>
        <MainScreen />
      </div>
      <Footer/>
    </div>
  );
}

export default App;
