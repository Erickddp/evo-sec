import { LayoutShell } from './components/layout/LayoutShell';
import { DashboardShell } from './components/dashboard/DashboardShell';

function App() {
    return (
        <LayoutShell>
            <DashboardShell />
        </LayoutShell>
    )
}

export default App
