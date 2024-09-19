import Image from "next/image";
import Siginup from "./signup/page";


export default function Home() {
  return (
    <html lang="en">
    <body>
      <header>
        <h1 >My App</h1> 

      </header>
      <main>
 
        <Siginup/>
      </main>
    </body>
  </html>
  );
}
