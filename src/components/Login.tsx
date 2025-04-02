import React from "react";

interface LoginProps {
  logo: string;
}

const Login: React.FC<LoginProps> = ({ logo }) => {
  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2">
      <div className="grid items-center gap-1.5 ">
        <div className="col-6 d-flex justify-content-start">
          <div className="p-3">
            <div
              className="bg-light rounded d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
                height: '40vw',
                top: '-8vw',
                color: 'black',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center rounded-[4rem] shadow-xl"
                style={{
                  width: "20vw",
                  height: "30vw",
                  backgroundColor: "#eaeae4",
                  opacity: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="img-fluid"
                  style={{
                    opacity: "100%",
                    maxHeight: "80%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid items-center gap-1.5">
        <div className="col-6 d-flex justify-content-start">
          <div className="p-3">
            <div
              className="bg-light rounded d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
                height: '40vw',
                top: '-15vw',
                color: 'black',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "50%",
                  height: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="d-flex flex-column justify-content-center" style={{ flex: 2 }}>

                  <div
                    className="btn fw-bold px-3 py-2 w-100"
                    style={{ backgroundColor: "white", }}
                  ><h2 className="fw-bold text-black mb-3 text-center">Login</h2></div>
                  <input
                    type="email"
                    className="form-control rounded-lg shadow-lg mb-3 px-3 py-2 w-100"
                    placeholder="E-mail"
                    style={{ borderColor: "#D3D3D3", color: "#A9A9A9" }}
                  />

                  <button
                    className="btn fw-bold rounded-lg shadow-xl px-3 py-2 w-100"
                    style={{
                      border: "2px solid black",
                      color: "#000",
                      backgroundColor: "white",
                      transition: "background-color 0.3s, color 0.3s, transform 0.1s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#000"; // Fundo preto
                      e.currentTarget.style.color = "#FFF"; // Texto branco
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white"; // Volta ao normal
                      e.currentTarget.style.color = "#000"; // Texto preto
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "scale(0.95)"; // Efeito de clique
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "scale(1)"; // Volta ao tamanho normal
                    }}
                  >
                    Entrar com e-mail
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;