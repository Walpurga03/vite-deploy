import React, { useState } from 'react';
import '../styles/main.scss'; 

const InfoPopup = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <>
            <button className="button info-button" onClick={togglePopup}>Info</button>
            {isPopupOpen && (
                <div className="popup-overlay">
                <div className="popup-content">
                  <div className="properties-info">
                    <h2>Regeln & Kategorien</h2>
                    <ul>
                      <li>- Der Spieler wählt eine Kategorie</li>
                      <li>- Der Spieler mit dem höchsten Wert gewinnt die Karte des anderen.</li>
                      <li>- Wenn beide Spieler den gleichen Wert haben, werden die Karten auf die Seite gelegt, und in der nächsten runde bekommt der Gewinner diesen Stapel.</li>  
                      <li>- Das Spiel endet, wenn ein Spieler alle Karten gewonnen hat</li>
                    </ul>

                    <h3>Seit</h3>
                    <ul>
                      <li>Das Jahr der erstmaligen Nutzung. Die älteste Karte gewinnt.</li>
                    </ul>
              
                    <h3>Knappheit</h3>
                    <ul>
                      <li>Wie schwer ist es, mehr davon zu produzieren?</li>
                    </ul>
              
                    <h3>Teilbarkeit</h3>
                    <ul>
                      <li>Wie gut kann man es teilen?</li>
                      </ul>
              
                    <h3>Transportfähigkeit</h3>
                    <ul>
                      <li>Wie gut kann man es transportieren?</li>
                    </ul>
              
                    <h3>Langlebigkeit</h3>
                    <ul>
                      <li>Ist es haltbar oder hat es einen vertrauensvollen Herausgeber?</li>
                    </ul>
                  </div>
                  <div className='schliesen-button'>
                   <button className="button" onClick={togglePopup}>Schließen</button>
                  </div>
                </div>
              </div>
              
            )}
        </>
    );
};

export default InfoPopup;
