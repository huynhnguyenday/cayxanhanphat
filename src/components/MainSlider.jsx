import { useEffect, useMemo, useRef, useState } from "react";

const MainSlider = () => {
  const words = useMemo(() => ["lắng", "lành", "khỏe", "yêu"], []);
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typingSpeed = isDeleting ? 60 : 110; // ms per char
    const holdDuration = 900; // ms to hold full word before deleting

    if (typingIntervalRef.current) clearTimeout(typingIntervalRef.current);

    const handleType = () => {
      if (!isDeleting) {
        const next = currentWord.slice(0, displayText.length + 1);
        setDisplayText(next);
        if (next === currentWord) {
          typingIntervalRef.current = setTimeout(
            () => setIsDeleting(true),
            holdDuration,
          );
          return;
        }
      } else {
        const next = currentWord.slice(0, displayText.length - 1);
        setDisplayText(next);
        if (next === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
      typingIntervalRef.current = setTimeout(handleType, typingSpeed);
    };

    typingIntervalRef.current = setTimeout(handleType, typingSpeed);

    return () => {
      if (typingIntervalRef.current) clearTimeout(typingIntervalRef.current);
    };
  }, [displayText, isDeleting, wordIndex, words]);

  return (
    <div className="flex items-center justify-center pt-32 pb-16">
      <div className="px-4 text-center text-[#633c02]">
        <h1 className="mb-4 font-josefin text-4xl font-bold lg:text-6xl">
          Đem cây cảnh <span className="text-[#00864a]">An Phát</span> về
        </h1>
        <h2 className="mx-auto inline-block min-h-[1.5em] font-josefin text-4xl font-bold lg:text-6xl">
          để <span className="text-[#00864a]">{displayText}</span>
          <span
            className="ml-1 inline-block w-1 animate-pulse bg-[#00864a]"
            style={{ height: "1em" }}
          />
        </h2>
      </div>
    </div>
  );
};

export default MainSlider;
