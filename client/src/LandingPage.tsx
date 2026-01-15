import type { PropsWithChildren} from "react";

function LandingPage({children} :PropsWithChildren){
    return(
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            <div className="flex justify-center items-center py-8">
                <h1 className="text-4xl font-bold text-gray-400">Discuss Here</h1>
            </div>

            <div className="flex-1 flex justify-center items-center">
                {children}
            </div>

            <div className="flex justify-center items-center py-4 text-sm text-gray-400">
                <footer>
                    <p>&copy; Piyush Singh</p>
                </footer>
            </div>
        </div>
    )
}

export default LandingPage;