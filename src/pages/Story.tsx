import Cards from "../components/sections/Story/Cards"
import DidYouKnow from "../components/sections/Story/DidYouKnow"
import Founder from "../components/sections/Story/Founder"
import Hero from "../components/sections/Story/Hero"

const Story = () => {
    return (
        <div>
            <Hero />
            <Cards />
            <DidYouKnow />
            <Founder />
        </div>
    )
}

export default Story