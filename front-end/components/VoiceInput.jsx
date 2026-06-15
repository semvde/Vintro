import {FaMicrophone} from "react-icons/fa6";
import {useEffect, useRef, useState} from "react";

export default function VoiceInput({inputSetter, styling, ...props}) {
    const recognitionRef = useRef(null);
    const [usingVoice, setUsingVoice] = useState(false);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.log("Speech Recognition wordt niet ondersteund.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "nl-NL";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            inputSetter(transcript);
            console.log(transcript);
        };

        recognition.onend = (event) => {
            setUsingVoice(false);
            console.log("Listening ended.");
        }

        recognition.onerror = (event) => {
            console.error(event.error);
        };

        recognitionRef.current = recognition;
    }, [inputSetter]);

    const startListening = () => {
        const recognition = recognitionRef.current;

        if (!recognition) return;

        try {
            setUsingVoice(true);
            recognition.start();
            console.log("Listening started...");
        } catch (err) {
            console.log("Recognition is al bezig.");
        }
    };

    return (
        <button onClick={startListening} disabled={usingVoice}
                className={"bg-secondary hover:bg-secondary-hover rounded-full p-2.5 disabled:animate-pulse disabled:bg-primary " + styling} {...props}>
            <FaMicrophone size={40} color="white"/>
        </button>
    );
}