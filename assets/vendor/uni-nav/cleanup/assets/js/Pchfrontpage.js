module.exports = (e) => {
	(PCHUSER.isSocialReg || PCHUSER.isMiniReg)?window.location.href = PCH.MiniRegURL:PCHSSOLightbox.searchCreatePassword();
}