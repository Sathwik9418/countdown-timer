"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Countdown () {

    const [duration, setDuration] = useState<number | string >("");
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timeRef = useRef<NodeJS.Timeout | null > (null);

    const handleSetDuration = () : void =>{
        if(typeof duration == "number" && duration > 0)
        {
            setTimeLeft(duration);
            setIsActive(false);
            setIsPaused(false);

            setDuration("");

            if(timeRef.current){
                clearInterval(timeRef.current);
            }
        }
    };

    const handleStart = (): void =>{
        if(timeLeft > 0){
            setIsActive(true);
            setIsPaused(false);
        }
    };


    const handlePause = ():void =>{
        if(isActive)
        {
            setIsPaused(true);
            setIsActive(false);
            if(timeRef.current){
                clearInterval(timeRef.current)
            }
        }
    }

    const handleReset = ():void=>{
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(typeof duration == "number" && duration>0 ? duration : 0);
        if(timeRef.current){
            clearInterval(timeRef.current);
        }
    }


    useEffect(()=>{
        if(isActive && !isPaused){
            timeRef.current = setInterval(() => {
               setTimeLeft((prevTime) => {
                if(prevTime <=1){
                    clearInterval(timeRef.current!);
                    return 0;
                }
                return prevTime-1;
               });
            }, 1000);
        }
        return ()=>{
            if(timeRef.current){
                clearInterval(timeRef.current)
            }
        };
    }, [isActive,isPaused]);


    const formatTime= (time:number): string =>{
        const minutes= Math.floor(time/60);
        const seconds=time%60;
        return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
    };

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>):void =>{
        setDuration(Number(e.target.value) || "");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">
            {/* Display the countdown timer */}
            <div className="text-5xl font-bold mb-9 text-slate-600">
                Countdown Timer
            </div>
            
            <div className="text-9xl font-bold mb-9 text-slate-400">
                {formatTime(timeLeft)}
            </div>
    
            {/* Conditional rendering of buttons based on timer state */}
            <div className="flex space-x-4">
                {/* Set button */}
                <Button 
                    onClick={handleSetDuration} 
                    className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 rounded text-xl border-[1.5px]"
                >
                    Set
                </Button>
    
                {/* Show Start button if the timer is not active and not paused */}
                {!isActive && !isPaused && timeLeft > 0 && (
                    <Button 
                        onClick={handleStart} 
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded text-xl"
                    >
                        Start
                    </Button>
                )}
    
                {/* Show Resume button if the timer is paused */}
                {!isActive && isPaused && timeLeft > 0 && (
                    <Button 
                        onClick={handleStart} 
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded text-xl"
                    >
                        Resume
                    </Button>
                )}
    
                {/* Show Pause button if the timer is active */}
                {isActive && (
                    <Button 
                        onClick={handlePause} 
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-4 rounded text-xl"
                    >
                        Pause
                    </Button>
                )}
    
                {/* Reset button */}
                <Button 
                    onClick={handleReset} 
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded text-xl"
                >
                    Reset
                </Button>
            </div>
    
            {/* Input field to set the duration */}
            <div className="w-full max-w-xs">
                <Input
                    type="number"
                    placeholder="Set Duration (seconds)"
                    value={duration}
                    onChange={handleDurationChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded text-white"
                />
            </div>
        </div>
    );
    
    
}