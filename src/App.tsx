import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Form from "./components/component/Form"
import { Toaster } from "react-hot-toast"
import Votaciones from "./components/component/Votaciones"
import CrearPropuesta from "./components/component/CrearPropuesta"
import ViewVotacion from "./components/component/ViewVotacion"
import ViewResults from "./components/component/ViewResults"

function App() {

  return (
    <>
      <Toaster position='top-right'reverseOrder={false}/>
     
      <Router>
        <Routes>
          <Route path="/login" element={<Form />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/menu" element={<Votaciones/>}/>
          <Route path="/create" element={<CrearPropuesta/>}/>
          <Route path="/vota/:idPropuesta" element={<ViewVotacion/>}/>
          <Route path="/results/:idPropuesta" element={<ViewResults/>}/>
        </Routes>
      </Router>
      
    </>

  )
}

export default App
