const routes = {
	HOME: `/`,
	GAME_CHOICES: `/game-choices`,
	LIVE_DRAWING: `/live-drawing`,
	LIVE_DRAWING_LOCKDOWN: `/live-drawing-lockdown`,
	PREV_DRAWING: `/previous-drawings`,
	RESULTS: `/results`,
	TIME_WASTER: `/bonus-game`,
	AD: `/ad`,
	PATH_GAMES: `/path-games-play/*`,
	PATH_GAMES_DYNAMIC_JS: `/path-games-play`,
	LEADERBOARD: `/leaderboard`,

	API: {
		CARDPLAY_SUBMIT: `/game/play/submit`,
		MOVE_NEXT: `/game/next`,
		GAME_UNRECOGNIZED_USER: `/game/unrecognizeduser`,
		CURRENT_GAME: `/game/current`,
		NEXT_GAME: `/game/nextdate`,
		SELECT_CHOICE: `game/choice/select`,
		COMPLETE_CHOICE: `game/choice/complete`,
		GAMES_PLAYED: `game/played`,
		DAILY_BONUS_CREDIT: `dailybonus/credit`,
		USER_PLAY_TIMES: `result/timings/[PLATFORM]/[DATE]`,
		DRAWING_NUMBERS: `/storage/drawings/`,
		DAILY_TOKEN_BALANCE: `/tokenbank/dailytokenleaderboard`,
		USER_CREATE_PASSWORD: `/user/createPassword`,
		CONTEST_ENTRY: `/contest-entry`,
		MATCHES: `/game/matches`
	},

	PJAX_BLACKLIST: [ /\/path-games-play/, /\/activate-next-path/ ]
};

function addRoute ( name, url ) {
	routes[name] = url;
}

export { addRoute };
export default routes;
