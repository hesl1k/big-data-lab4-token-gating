import './style.css';
export const metadata={title:'Poster',description:'Гостевая книга'};
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>}
