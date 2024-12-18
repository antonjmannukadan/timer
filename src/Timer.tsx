import React, { useState, useRef, useEffect } from 'react';

const Timer: React.FC = () => {

    const [minutes, setMinutes] = useState<number>(0);

    const [seconds, setSeconds] = useState<number>(0);

    const [remainingTime, setRemainingTime] = useState<number | null>(null)

    const [isRunning, setIsRunning] = useState<boolean>(false);

    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const tickSound = useRef<HTMLAudioElement | null>(null);

    const buzzerSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {

        tickSound.current = new Audio('/tick.mp3');

        tickSound.current.volume = 0.5;

        buzzerSound.current = new Audio('/buzzer.mp3');

        buzzerSound.current.volume = 1;
    }, []);

    useEffect(() => {

        if (isRunning && remainingTime !== null && remainingTime > 0 && !isTimeUp) {

            timerRef.current = setInterval(() => {

                setRemainingTime((prevTime) => {

                    if (prevTime === 1) {

                        clearInterval(timerRef.current as NodeJS.Timeout);
                        setIsTimeUp(true);
                        if (tickSound.current) tickSound.current.pause();
                        if (buzzerSound.current) buzzerSound.current.play();

                        setIsRunning(false);

                        return 0;
                    }

                    if (tickSound.current && !isTimeUp) {
                        tickSound.current.play();
                    }
                    return (prevTime || 1) - 1;

                });
            }, 1000);

        } else {

            clearInterval(timerRef.current as NodeJS.Timeout);
        }


        return () => clearInterval(timerRef.current as NodeJS.Timeout);
    },
        [isRunning, remainingTime, isTimeUp]);

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60).toString().padStart(2, '0');
        const secs = (time % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`
    };

    const handleStart = () => {
        if (!isRunning && (minutes > 0 || seconds > 0)) {
            setRemainingTime(minutes * 60 + seconds);
            setIsRunning(true);
            setIsTimeUp(false);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
        clearInterval(timerRef.current as NodeJS.Timeout);
    };

    const handleReset = () => {
        setIsRunning(false);
        setRemainingTime(null);
        setMinutes(0);
        setSeconds(0);
        setIsTimeUp(false);
        clearInterval(timerRef.current as NodeJS.Timeout);
        if (buzzerSound.current) buzzerSound.current.pause();
        if (tickSound.current) tickSound.current.pause();

    };

    return (

        <div style={fullscreenContainerStyle}>
            <h1 style={titleStyle}>Digital Timer</h1>
            <div style={settingsStyle}>
                <div style={inlineSettingsStyle}>
                    <div style={labelContainerStyle}>
                        <label style={labelStyle}>Minutes:</label>
                        <input
                            type="number"
                            min="0"
                            value={minutes}
                            onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                            style={inputStyle} />
                    </div>

                    <div style={labelContainerStyle}>

                        <label style={labelStyle}>Seconds: </label>

                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={seconds}
                            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Timer Display */}

            <div style={timerDisplaystyle}>

                {remainingTime != null ? formatTime(remainingTime) : formatTime(minutes * 60 + seconds)}
            </div>


            <div style={buttonContainerStyle}>

                <button onClick={handleStart} style= {buttonStyle}>

                    Start

                </button>

                <button onClick={handleStop} style={buttonStyle}>

                    Stop

                </button>

                <button onClick={handleReset} style={buttonStyle}>

                    Reset
                </button>
            </div>
            <div style={footerStyle}>By Anton</div>
        </div>
    );
};

// styles

const fullscreenContainerStyle: React.CSSProperties = {

    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'space-between',
    height: '100vh',

    alignItems: 'center',
    width: '100vw',
    fontFamily: 'monospace',
    backgroundColor: '#282c34',
    color: 'white',
    padding: '20px',
};

const titleStyle: React.CSSProperties = { fontSize: '48px', marginBottom: '20px', color: '#61dafb', };

const settingsStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 4, };

const inlineSettingsStyle: React.CSSProperties = { display: 'flex', gap: '30px', alignItems: 'center', };

const labelContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const labelStyle: React.CSSProperties = { fontSize: '20px', marginBottom: '1px' };
const inputStyle: React.CSSProperties = {

    width: '100px',

    padding: '10px',

    fontSize: '20px',

    textAlign: 'center',

    borderRadius: '10px',

    border: '1px solid #ccc',

    backgroundColor: '#fsfsfs'
}

const timerDisplaystyle: React.CSSProperties = {

    fontSize: '96px',

    color: '#0f0',
    backgroundColor: '#000',
    padding: '40px',
    height: '15vh',
    width: '30vw',
    marginBottom: '0px',
    borderRadius: '15px',
    textAlign: 'center',
    flex: .4,
}

const buttonContainerStyle: React.CSSProperties = {

    display: 'flex',

    justifyContent: 'center',

    gap: '20px',

    marginTop: '20px',
}
const buttonStyle: React.CSSProperties = {

    padding: '15px 40px',

    fontSize: '20px',
    borderRadius: '10px',

    border: 'none',

    cursor: 'pointer',

    color: 'white',

    backgroundColor: '#4CAF58',
    transition: 'background-color 0.3s ease',

}

const footerStyle: React.CSSProperties = {
    // marginTop: 'auto',

    fontSize: '16px',

    color: '#888'
}


export default Timer;