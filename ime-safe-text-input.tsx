import { useState, useEffect } from 'react';

export const IMESafeInput = () => {
    // Control the input value
    const [input, setInput] = useState("");
    // Track if the IME is open (when open, user is composing)
    const [isComposing, setIsComposing] = useState(false);
    // Because safari fires events opposite compared to other browsers, we need another way to detect if the IME was open just now
    const [compositionJustEnded, setCompositionJustEnded] = useState(false);
    // Track if the user is using Safari
    const [isSafari, setIsSafari] = useState(false);

    // Check if the user is using Safari
    useEffect(() => {
        setIsSafari((navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Chromium")) ? true : false)
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Detect any combination of enter key press
        if (e.key === "Enter") {
            // Detect an isolated enter key press 
            if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
                // Check if the user is not composing, then submit
                // (!isComposing && !isSafari) => User is not composing (using IME) and not using safari
                // or
                // (isSafari && !compositionJustEnded) => User is using safari and user didn't just end composing. If we checked isComposing in this case, it would be false, as Safari fires onCompositionEnd before onKeyDown. Therefore, we must check if the user has been using the IME in the past.
                if ((!isComposing && !isSafari) || (isSafari && !compositionJustEnded)) {
                    e.preventDefault();
                    setInput("");
                    handleSubmit();
                }
            }
        }
        // We set if user has been using IME in the past to false, so that on the next handleKeyDown, an IME must close for this to be true again.
        setCompositionJustEnded(false);
    };

    const handleSubmit = async () => {
        // Your own submit logic here
    }

    return (
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => {setIsComposing(false); setCompositionJustEnded(true);}}
        />
    )
}
