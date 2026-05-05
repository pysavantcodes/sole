import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Why from '../pages/Why'
import Story from '../pages/Story'
import Ecosystem from '../pages/Ecosystem'
import NotFound from '../pages/NotFound'


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/why" element={<Why />} />
            <Route path="/story" element={<Story />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes