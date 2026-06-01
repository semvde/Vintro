import {Link} from "react-router";


export default function Home() {
    return (
        <div className="flex justify-between flex-col">
            <section className="flex flex-col space-y-15">
                <div>
                    <div>
                        <p>Voor jongeren die werk zoeken</p>
                        <h1>Van twijfel naar werk!</h1>
                        <p>Vintro bouwt samen met jou een sterk CV,
                            oefent sollicitatiegesprekken met AI en leert je
                            in korte video's hoe het echt werkt.</p>
                    </div>
                    <div className="flex justify-between">
                        <Link className="bg-primary shadow-md pb-3 pt-3 pl-8 pr-8 rounded-3xl text-white" to="/">Start nu!  </Link>

                        <Link className="bg-white pb-3 pt-3 pl-8 pr-8 shadow-md rounded-3xl text-black" to="/">Zo werkt het</Link>
                    </div>
                </div>
                <div className="bg-primary/20 p-4 rounded-xl h-1/2 flex flex-col">
                    <div className="bg-primary/20 rounded-xl justify-between flex flex-row p-4">
                        <img alt="ai mannetje"/>
                        <div className="bg-primary w-3/4 p-1 pb-6 rounded-t-md textbubble">
                            <div className="bg-white p-4 h-full w-full">
                                <h2 className="text-primary font-bold">
                                    Chat met <br/> coach Marcus!
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 pb-3 rounded-xl  flex w-full items-center" >
                        <input className="bg-white p-2 h-full w-full" placeholder="|"/>
                    </div>
                </div>
            </section>

            <section>
                <div className="bg-secondary/20 mt-20 p-6 pb-15 ">
                    <h2 className="pb-4">
                        In 3 stappen klaar om te solliciteren!
                    </h2>
                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col p-4 rounded-md bg-white">
                            <div className="flex flex-row justify-between">
                                <h3>Onboarding gesprek met onze coach</h3>
                                <h3 className="text-primary"> 01</h3>
                            </div>

                            <p>Onze AI coach stelt vragen over jou, je dromen en je ervaring.</p>
                        </div>
                        <div className="flex flex-col p-4 rounded-md bg-white">
                            <div className="flex flex-row justify-between">
                                <h3>Je Cv wordt gegenereerd</h3>
                                <h3 className="text-primary"> 02</h3>
                            </div>

                            <p>Op basis van het gesprek, maakt de AI een professioneel CV dat je kan aanpassen.</p>
                        </div>
                        <div className="flex flex-col p-4 rounded-md bg-white">
                            <div className="flex flex-row justify-between">
                                <h3>Train op de 3 onderdelen</h3>
                                <h3 className="text-primary"> 03</h3>
                            </div>

                            <p>Solliciteer op vacatures, oefen interviews en kijk korte tips-video’s.</p>
                        </div>
                    </div>
                    <div className="pt-10 flex justify-center">
                    <Link className=" w-fit h-full bg-primary shadow-md pb-3 pt-3 pl-8 pr-8 rounded-3xl text-white" to="/">
                        Start jouw onboarding
                    </Link>
                </div>
                </div>
            </section>
        </div>
    )
}