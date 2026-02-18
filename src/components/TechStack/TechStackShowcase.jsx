import Counters from './Counters';
import Marquee from './Marquee';
import TechStack from './TechStack';
import HorizontalCards from './HorizontalCards';
import './TechStackShowcase.css';

/**
 * TechStackShowcase
 * Complete tech stack presentation with counters, marquees, tech chips, and horizontal cards
 *
 * Usage:
 * ```jsx
 * import { TechStackShowcase } from './components/TechStack';
 *
 * function App() {
 *   return <TechStackShowcase />;
 * }
 * ```
 */
const TechStackShowcase = () => {
    return (
        <div className="tech-stack-showcase">
            {/* Animated counters */}
            <Counters />

            {/* Infinite marquees */}
            <Marquee />

            {/* Tech stack chips */}
            <TechStack />

            {/* Horizontal scroll cards */}
            <HorizontalCards />
        </div>
    );
};

export default TechStackShowcase;
