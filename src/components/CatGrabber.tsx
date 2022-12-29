import { useEffect, useMemo, useState } from 'react'
import type { Cat } from '../types';

type State = {
    isLoading: boolean;
    cat: string | null;
};

const CatGrabber = () => {
    const [catHistory, setCatHistory] = useState<Array<string>>([]);
    const [catState, setCatState] = useState<State>({ isLoading: false, cat: null });

    const previousCat = (): void => {
        if (catHistory.length === 0) return;
        const prevCat = catHistory.pop();
        setCatState({ ...catState, cat: prevCat! });
        setCatHistory(catHistory.filter(x => x !== prevCat));
    }

    const fetchCat = async (): Promise<void> => {
        setCatState({ ...catState, isLoading: true });
        const res = await fetch("https://cataas.com/cat?json=true");
        const { url } = (await res.json()) as Cat;
        const catImageUrl = `https://cataas.com${url}`;
        if (catState.cat) setCatHistory([...catHistory, catState.cat]);
        setCatState({ ...catState, isLoading: false, cat: catImageUrl });
    };

    const prevDisabled = useMemo<boolean>(() => catHistory.length === 0, [catHistory]);

    useEffect(() => {
        fetchCat();
    }, [])

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-row justify-center items-center">
                <button
                    type='button'
                    name='previous-cat'
                    className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 mr-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed'
                    onClick={previousCat}
                    disabled={prevDisabled || catState.isLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 m-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                </button>
                <div className="lg:w-96 lg:h-96 md:w-80 md:h-80 w-52 h-48 border border-gray-300 rounded-md drop-shadow-sm">
                    {catState.cat && <img
                        src={catState.cat}
                        alt='cat'
                        className={`w-full h-full object-cover rounded-md animate-in fade-in duration-300 delay-150 ${catState.isLoading ? 'opacity-20' : 'opacity-100'}`} />}
                </div>
                <button
                    type='button'
                    name='next-cat'
                    className='h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 ml-2 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white'
                    onClick={fetchCat}
                    disabled={catState.isLoading}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 m-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default CatGrabber