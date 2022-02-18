import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from "axios";
import { useEffect, useState } from 'react';
import PageNav from '../Components/PageNav';
import CardList from '../Components/CardList';
import Main from '../Components/Main';

export default function Home() {
	const [characters, setCharacters] = useState([]);
	const [pageInfo, setPageInfo] = useState([]);
	const [selectedCard, setSelectedCard] = useState([]);

	const [characterUrl, setCharacterUrl] = useState("https://rickandmortyapi.com/api/character/?page=3");
	//const [page, setPage] = useState(0);

	useEffect(() => {
		const requestData = async () => {
			const axiosData = await axios.get(characterUrl)
				.then(function (res) {
					setCharacters(res.data.results);
					setPageInfo(res.data.info)
					/*let urlParams = new URLSearchParams(characterUrl);
					setPage(urlParams.get('page'));*/
					console.log("Success " + res.data);
				})
				.catch(function (res) {
					if (res instanceof Error) {
						console.log("Failed " + res.message);
					} else {
						console.log("Didn't fail " + res.data);
					}
				});
		}
		return requestData();
	}, [characterUrl]);

	console.log("characters from " + characters);

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>

				{pageInfo && (
					<>
						<PageNav nav={pageInfo} setCharacterUrl={setCharacterUrl} />
						<Main 
							character={characters} 
							selectedCard={selectedCard}
							page={pageInfo.pages}
						/>
						
						<CardList character={characters} setSelectedCard={setSelectedCard} />
					</>
				)
				}
			</main>

			<footer className={styles.footer}>

			</footer>
		</div>
	)
}
