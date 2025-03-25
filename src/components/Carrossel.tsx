import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import "@/styles/Carrossel.css"; 

interface CarrosselProps {
  children: React.ReactNode[];
  linhas?: number; // Quantidade de linhas (padrão: 1)
}

const Carrossel: React.FC<CarrosselProps> = ({ children, linhas = 1 }) => {
  const [index, setIndex] = useState(0);
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [carrosselWidth, setCarrosselWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Usa useLayoutEffect para medir a largura inicial do carrossel
  useLayoutEffect(() => {
    if (carrosselRef.current) {
      const width = carrosselRef.current.getBoundingClientRect().width;
      setCarrosselWidth(width);
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // Atualiza a largura e detecta mobile ao redimensionar a janela
  useEffect(() => {
    const updateSizes = () => {
      if (carrosselRef.current) {
        const width = carrosselRef.current.getBoundingClientRect().width;
        setCarrosselWidth(width);
        setIsMobile(window.innerWidth < 768);
      }
    };

    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Se for mobile, exibe 1 item por slide; caso contrário, exibe 3
  const actualColumns = isMobile ? 1 : 3;
  const itemsPerSlide = linhas * actualColumns;
  const slides: React.ReactNode[][] = [];
  
  for (let i = 0; i < children.length; i += itemsPerSlide) {
    slides.push(children.slice(i, i + itemsPerSlide));
  }
  
  const totalSlides = slides.length;
  // Se mobile, cada card terá a largura total do carrossel; senão, divide pela quantidade de colunas
  const cardWidth = isMobile ? carrosselWidth : carrosselWidth / actualColumns;
  const cardHeight = isMobile ? 100 : 100 / linhas;

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="carrossel-container" ref={carrosselRef} style={{ width: "100%" }}>
      <button className="carrossel-btn left" onClick={prevSlide}>
        {"<"}
      </button>

      <div className="carrossel">
        <div
          className="carrossel-inner"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className="carrossel-slide"
              style={{
                flex: "0 0 100%",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {slide.map((child, i) => (
                <div key={i} className="carrossel-item" style={{ width: `${cardWidth}px`, height: `${cardHeight}%` }}>
                  {child}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button className="carrossel-btn right" onClick={nextSlide}>
        {">"}
      </button>
    </div>
  );
};

export default Carrossel;
