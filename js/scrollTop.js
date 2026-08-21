(function ()
{
	const button = document.getElementById('scrollTopButton');
	if (!button)
	{
		return;
	}

	function updateVisibility()
	{
		if (window.scrollY > 300)
		{
			button.classList.add('is-visible');
		}
		else
		{
			button.classList.remove('is-visible');
		}
	}

	window.addEventListener('scroll', updateVisibility);
	updateVisibility();

	button.addEventListener('click', function ()
	{
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
})();