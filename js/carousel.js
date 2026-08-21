(function ()
{
	function initCarousel(root)
	{
		const track = root.querySelector('[data-carousel-track]');
		const slides = Array.from(track.children);
		const prevBtn = root.querySelector('[data-carousel-prev]');
		const nextBtn = root.querySelector('[data-carousel-next]');
		const dotsWrap = root.querySelector('[data-carousel-dots]');
		let index = 0;
		let autoplayId = null;
		const autoplayDelay = 7000;

		slides.forEach(function (slide, i)
		{
			const dot = document.createElement('button');
			dot.className = 'carousel-dot';
			dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
			dot.addEventListener('click', function ()
			{
				goTo(i);
			});
			dotsWrap.appendChild(dot);
		});
		const dots = Array.from(dotsWrap.children);

		function update()
		{
			track.style.transform = 'translateX(-' + (index * 100) + '%)';
			dots.forEach(function (dot, i)
			{
				dot.classList.toggle('is-active', i === index);
			});
		}

		function goTo(newIndex)
		{
			index = (newIndex + slides.length) % slides.length;
			update();
		}

		function next()
		{
			goTo(index + 1);
		}

		function prev()
		{
			goTo(index - 1);
		}

		function startAutoplay()
		{
			stopAutoplay();
			autoplayId = setInterval(next, autoplayDelay);
		}

		function stopAutoplay()
		{
			if (autoplayId)
			{
				clearInterval(autoplayId);
				autoplayId = null;
			}
		}

		nextBtn.addEventListener('click', function ()
		{
			next();
			startAutoplay();
		});

		prevBtn.addEventListener('click', function ()
		{
			prev();
			startAutoplay();
		});

		root.addEventListener('mouseenter', stopAutoplay);
		root.addEventListener('mouseleave', startAutoplay);
		root.addEventListener('focusin', stopAutoplay);
		root.addEventListener('focusout', startAutoplay);

		root.setAttribute('tabindex', '0');
		root.addEventListener('keydown', function (e)
		{
			if (e.key === 'ArrowLeft')
			{
				prev();
				startAutoplay();
			}
			else if (e.key === 'ArrowRight')
			{
				next();
				startAutoplay();
			}
		});

		let touchStartX = null;
		root.addEventListener('touchstart', function (e)
		{
			touchStartX = e.touches[0].clientX;
			stopAutoplay();
		}, { passive: true });

		root.addEventListener('touchend', function (e)
		{
			if (touchStartX === null)
			{
				return;
			}
			const deltaX = e.changedTouches[0].clientX - touchStartX;
			if (deltaX > 40)
			{
				prev();
			}
			else if (deltaX < -40)
			{
				next();
			}
			touchStartX = null;
			startAutoplay();
		});

		update();
		startAutoplay();
	}

	document.querySelectorAll('[data-carousel]').forEach(initCarousel);
})();