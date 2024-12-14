/*
	Ethereal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	// Settings.
		var settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: true,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				},

			// Dragging.
				dragging: {

					// If true, enables scrolling by dragging the main wrapper with the mouse.
						enabled: true,

					// Sets the momentum factor. Must be a value between 0 and 1 (lower = less momentum, higher = more momentum, 0 = disable momentum scrolling).
						momentum: 0.875,

					// Sets the drag threshold (in pixels).
						threshold: 10

				},

			// If set to a valid selector , prevents key/mouse events from bubbling from these elements.
				excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',

			// Link scroll speed.
				linkScrollSpeed: 1000

		};

	// Vars.
		var	$window = $(window),
			$document = $(document),
			$body = $('body'),
			$html = $('html'),
			$bodyHtml = $('body,html'),
			$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			short:    '(min-aspect-ratio: 16/7)',
			xshort:   '(min-aspect-ratio: 16/6)'
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;
					settings.dragging.enabled = false;

				// Re-enable overflow on body.
					$body.css('overflow-x', 'auto');

			}

		// IE: Various fixes.
			if (browser.name == 'ie') {

				// Enable IE mode.
					$body.addClass('is-ie');

				// Page widths.
					$window
						.on('load resize', function() {

							// Calculate wrapper width.
								var w = 0;

								$wrapper.children().each(function() {
									w += $(this).width();
								});

							// Apply to page.
								$html.css('width', w + 'px');

						});

			}

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$wrapper

					// Prevent keystrokes inside excluded elements from bubbling.
						.on('keypress keyup keydown', settings.excludeSelector, function(event) {

							// Stop propagation.
								event.stopPropagation();

						});

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$document.scrollLeft($document.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$document.scrollLeft($document.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$document.scrollLeft($document.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$document.scrollLeft($document.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$document.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$document.scrollLeft($document.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$bodyHtml.stop();

								}

						});

			})();

	// Scroll wheel.
		if (settings.scrollWheel.enabled)
			(function() {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
					var normalizeWheel = function(event) {

						var	pixelStep = 10,
							lineHeight = 40,
							pageHeight = 800,
							sX = 0,
							sY = 0,
							pX = 0,
							pY = 0;

						// Legacy.
							if ('detail' in event)
								sY = event.detail;
							else if ('wheelDelta' in event)
								sY = event.wheelDelta / -120;
							else if ('wheelDeltaY' in event)
								sY = event.wheelDeltaY / -120;

							if ('wheelDeltaX' in event)
								sX = event.wheelDeltaX / -120;

						// Side scrolling on FF with DOMMouseScroll.
							if ('axis' in event
							&&	event.axis === event.HORIZONTAL_AXIS) {
								sX = sY;
								sY = 0;
							}

						// Calculate.
							pX = sX * pixelStep;
							pY = sY * pixelStep;

							if ('deltaY' in event)
								pY = event.deltaY;

							if ('deltaX' in event)
								pX = event.deltaX;

							if ((pX || pY)
							&&	event.deltaMode) {

								if (event.deltaMode == 1) {
									pX *= lineHeight;
									pY *= lineHeight;
								}
								else {
									pX *= pageHeight;
									pY *= pageHeight;
								}

							}

						// Fallback if spin cannot be determined.
							if (pX && !sX)
								sX = (pX < 1) ? -1 : 1;

							if (pY && !sY)
								sY = (pY < 1) ? -1 : 1;

						// Return.
							return {
								spinX: sX,
								spinY: sY,
								pixelX: pX,
								pixelY: pY
							};

					};

				// Wheel event.
					$body.on('wheel', function(event) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Stop link scroll.
							$bodyHtml.stop();

						// Calculate delta, direction.
							var	n = normalizeWheel(event.originalEvent),
								x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
								delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
								direction = x > 0 ? 1 : -1;

						// Scroll page.
							$document.scrollLeft($document.scrollLeft() + (delta * direction));

					});

			})();

	// Scroll zones.
		if (settings.scrollZones.enabled)
			(function() {

				var	$left = $('<div class="scrollZone left"></div>'),
					$right = $('<div class="scrollZone right"></div>'),
					$zones = $left.add($right),
					paused = false,
					intervalId = null,
					direction,
					activate = function(d) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Paused? Bail.
							if (paused)
								return;

						// Stop link scroll.
							$bodyHtml.stop();

						// Set direction.
							direction = d;

						// Initialize interval.
							clearInterval(intervalId);

							intervalId = setInterval(function() {
								$document.scrollLeft($document.scrollLeft() + (settings.scrollZones.speed * direction));
							}, 25);

					},
					deactivate = function() {

						// Unpause.
							paused = false;

						// Clear interval.
							clearInterval(intervalId);

					};

				$zones
					.appendTo($wrapper)
					.on('mouseleave mousedown', function(event) {
						deactivate();
					});

				$left
					.css('left', '0')
					.on('mouseenter', function(event) {
						activate(-1);
					});

				$right
					.css('right', '0')
					.on('mouseenter', function(event) {
						activate(1);
					});

				$wrapper
					.on('---pauseScrollZone', function(event) {

						// Pause.
							paused = true;

						// Unpause after delay.
							setTimeout(function() {
								paused = false;
							}, 500);

					});

			})();

	// Dragging.
		if (settings.dragging.enabled)
			(function() {

				var dragging = false,
					dragged = false,
					distance = 0,
					startScroll,
					momentumIntervalId, velocityIntervalId,
					startX, currentX, previousX,
					velocity, direction;

				$wrapper

					// Prevent image drag and drop.
						.on('mouseup mousemove mousedown', '.image, img', function(event) {
							event.preventDefault();
						})

					// Prevent mouse events inside excluded elements from bubbling.
						.on('mouseup mousemove mousedown', settings.excludeSelector, function(event) {

							// Prevent event from bubbling.
								event.stopPropagation();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

						})

					// Mousedown event.
						.on('mousedown', function(event) {

							// Disable on <=small.
								if (breakpoints.active('<=small'))
									return;

							// Clear momentum interval.
								clearInterval(momentumIntervalId);

							// Stop link scroll.
								$bodyHtml.stop();

							// Start drag.
								dragging = true;
								$wrapper.addClass('is-dragging');

							// Initialize and reset vars.
								startScroll = $document.scrollLeft();
								startX = event.clientX;
								previousX = startX;
								currentX = startX;
								distance = 0;
								direction = 0;

							// Initialize velocity interval.
								clearInterval(velocityIntervalId);

								velocityIntervalId = setInterval(function() {

									// Calculate velocity, direction.
										velocity = Math.abs(currentX - previousX);
										direction = (currentX > previousX ? -1 : 1);

									// Update previous X.
										previousX = currentX;

								}, 50);

						})

					// Mousemove event.
						.on('mousemove', function(event) {

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Velocity.
								currentX = event.clientX;

							// Scroll page.
								$document.scrollLeft(startScroll + (startX - currentX));

							// Update distance.
								distance = Math.abs(startScroll - $document.scrollLeft());

							// Distance exceeds threshold? Disable pointer events on all descendents.
								if (!dragged
								&&	distance > settings.dragging.threshold) {

									$wrapper.addClass('is-dragged');

									dragged = true;

								}

						})

					// Mouseup/mouseleave event.
						.on('mouseup mouseleave', function(event) {

							var m;

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Dragged? Re-enable pointer events on all descendents.
								if (dragged) {

									setTimeout(function() {
										$wrapper.removeClass('is-dragged');
									}, 100);

									dragged = false;

								}

							// Distance exceeds threshold? Prevent default.
								if (distance > settings.dragging.threshold)
									event.preventDefault();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

							// Initialize momentum interval.
								if (settings.dragging.momentum > 0) {

									m = velocity;

									momentumIntervalId = setInterval(function() {

										// Momentum is NaN? Bail.
											if (isNaN(m)) {

												clearInterval(momentumIntervalId);
												return;

											}

										// Scroll page.
											$document.scrollLeft($document.scrollLeft() + (m * direction));

										// Decrease momentum.
											m = m * settings.dragging.momentum;

										// Negligible momentum? Clear interval and end.
											if (Math.abs(m) < 1)
												clearInterval(momentumIntervalId);

									}, 15);

								}

						});

			})();

	// Link scroll.
		$wrapper
			.on('mousedown mouseup', 'a[href^="#"]', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.on('click', 'a[href^="#"]', function(event) {

				var	$this = $(this),
					href = $this.attr('href'),
					$target, x, y;

				// Get target.
					if (href == '#'
					||	($target = $(href)).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Calculate x, y.
					if (breakpoints.active('<=small')) {

						x = $target.offset().top - (Math.max(0, $window.height() - $target.outerHeight()) / 2);
						y = { scrollTop: x };

					}
					else {

						x = $target.offset().left - (Math.max(0, $window.width() - $target.outerWidth()) / 2);
						y = { scrollLeft: x };

					}

				// Scroll.
					$bodyHtml
						.stop()
						.animate(
							y,
							settings.linkScrollSpeed,
							'swing'
						);

			});

	// Gallery.
		$('.gallery')
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$modalImg = $modal.find('img');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Clear visible, loaded.
					$modal
						.removeClass('loaded')

				// Delay.
					setTimeout(function() {

						$modal
							.removeClass('visible')

						// Pause scroll zone.
							$wrapper.triggerHandler('---pauseScrollZone');

						setTimeout(function() {

							// Clear src.
								$modalImg.attr('src', '');

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('keypress', '.modal', function(event) {

				var $modal = $(this);

				// Escape? Hide modal.
					if (event.keyCode == 27)
						$modal.trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
				.find('img')
					.on('load', function(event) {

						var $modalImg = $(this),
							$modal = $modalImg.parents('.modal');

						setTimeout(function() {

							// No longer visible? Bail.
								if (!$modal.hasClass('visible'))
									return;

							// Set loaded.
								$modal.addClass('loaded');

						}, 275);

					});

})(jQuery);



/* ------------------------------ */
/*           CUSTOM  JS           */
/* ------------------------------ */



/* /Mobi|Android/i.test */

	// Fonction pour détecter si l'utilisateur est sur un appareil mobile

		function isMobile() {
			return /Mobi|Android/i.test(navigator.userAgent);
		}



/* audioPlaylist */

	// autoPlayAudio

		// L'événement DOMContentLoaded est déclenché lorsque le document HTML a été complètement chargé et analysé
		document.addEventListener("DOMContentLoaded", () => {
			// Variables
			const popup = document.getElementById("popup");
			const acceptButton = document.getElementById("acceptButton");
			const rejectButton = document.getElementById("rejectButton");
			const popupPursue = document.getElementById("popupPursue");
			const resumeButton = document.getElementById("resumeButton");
			const cancelButton = document.getElementById("cancelButton");
			const audio = document.getElementById("audio");
			let isAudioPlaying = false;
		
			// Functions
		
			// Fonction pour afficher une popup avec un délai
			const showPopup = (popupElement) => {
				setTimeout(() => {
					popupElement.style.display = "block";
					popupElement.style.zIndex = 2147483647;
				}, 1000);
			};
		
			// Fonction pour démarrer la lecture audio
			const playAudio = () => {
				isAudioPlaying = true;
				audio.play().catch(error => console.error("Audio play error: ", error));
			};
		
			// Fonction pour gérer la réponse de l'utilisateur à la proposition
			const handleUserResponse = (response) => {
				sessionStorage.setItem("userResponse", response);
				popup.style.display = "none";
				if (response === "accepted") {
					playAudio(); // Si la réponse est "accepted", démarrer la lecture audio
				}
			};
		
			// Fonction pour reprendre la lecture audio
			const handleResume = () => {
				popupPursue.style.display = "none";
				playAudio(); // Reprendre la lecture audio
			};
		
			// Fonction pour annuler la reprise et réinitialiser la playlist audio
			const handleCancel = () => {
				popupPursue.style.display = "none";
				sessionStorage.setItem("userResponse", "rejected");
				resetPlaylist(); // Réinitialiser la playlist audio
			};
		
			// Fonction pour réinitialiser la playlist audio
			const resetPlaylist = () => {
				const sources = audio.getElementsByTagName('source');
				if (sources.length > 0) {
					audio.src = sources[0].src;
					audio.load();
				}
			};
		
			// Fonction pour passer à la piste audio suivante dans la playlist
			const playNext = () => {
				const sources = Array.from(audio.getElementsByTagName('source'));
				const currentSourceIndex = sources.findIndex(src => src.src === audio.src);
				const nextSourceIndex = (currentSourceIndex + 1) % sources.length;
		
				audio.src = sources[nextSourceIndex].src;
				audio.load();
				playAudio(); // Démarrer la lecture audio de la piste suivante
			};
		
			// Gestionnaires d'événements
		
			// Ajouter des écouteurs d'événements pour les différents boutons
			acceptButton.addEventListener("click", () => handleUserResponse("accepted"));
			rejectButton.addEventListener("click", () => {
				handleUserResponse("rejected");
				resetPlaylist(); // Réinitialiser la playlist audio si la proposition est rejetée
			});
			resumeButton.addEventListener("click", handleResume);
			cancelButton.addEventListener("click", handleCancel);
		
			// Gestion de la lecture audio lors de la perte de focus de la fenêtre
			window.addEventListener("blur", () => {
				isAudioPlaying = !audio.paused;
				audio.pause();
			});
		
			// Gestion de l'affichage des popups lors du regain de focus de la fenêtre
			window.addEventListener("focus", () => {
				const userResponseOnFocus = sessionStorage.getItem("userResponse");
				if (!userResponseOnFocus && popup.style.display !== "block") {
					showPopup(popup); // Afficher la popup initiale si aucune réponse précédente n'est enregistrée et si la popup n'est pas déjà affichée
				} else if (userResponseOnFocus === "accepted") {
					showPopup(popupPursue); // Afficher la popup de reprise si la réponse précédente est "accepted"
				} else if (userResponseOnFocus === "rejected") {
					showPopup(popup); // Afficher la popup initiale si la réponse précédente est "rejected"
				}
			});
		
			// Gestion de la lecture de la piste audio suivante à la fin de la piste actuelle
			audio.addEventListener("ended", playNext);
		
			// Initialisation
		
			// Réinitialiser la réponse de l'utilisateur à chaque chargement de page
			sessionStorage.removeItem("userResponse");
			// Afficher toujours la popup initiale au chargement de la page
			showPopup(popup);
		});



/* autoScroll */

	// autoScroll /Mobi|Android/i
	
        // L769. Fonction pour détecter si l'utilisateur est sur un appareil mobile

        // Constantes pour les valeurs configurables
        const SCROLL_STEP = 1; // Nombre de pixels à faire défiler par intervalle
        const DELAY = 15; // Intervalle en millisecondes entre chaque défilement
        const TOUCH_SENSITIVITY = 10; // Sensibilité du mouvement de doigt

        let isPaused = false; // Variable pour suivre l'état de la pause du défilement

        // Fonction pour démarrer le gestionnaire d'événement de défilement
        function startAutoScroll() {
            if (isMobile()) {
                // Défilement vertical pour les appareils mobiles
                function scrollDown() {
                    if (!isPaused) {
                        window.scrollBy(0, SCROLL_STEP); // Fait défiler la fenêtre vers le bas
                        // Vérifie si la fenêtre a atteint le bas de la page
                        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                            setTimeout(scrollUp, DELAY); // Si le bas de la page est atteint, défile vers le haut
                        } else {
                            setTimeout(scrollDown, DELAY); // Sinon, continue de défiler vers le bas
                        }
                    }
                }

                function scrollUp() {
                    if (!isPaused) {
                        window.scrollBy(0, -SCROLL_STEP); // Fait défiler la fenêtre vers le haut
                        // Vérifie si la fenêtre a atteint le haut de la page
                        if (window.scrollY <= 0) {
                            setTimeout(scrollDown, DELAY); // Si le haut de la page est atteint, défile vers le bas
                        } else {
                            setTimeout(scrollUp, DELAY); // Sinon, continue de défiler vers le haut
                        }
                    }
                }

                scrollDown(); // Démarre le défilement vers le bas

                let touchStartY = 0;

                // Gestion des événements tactiles
                window.addEventListener('touchstart', function(event) {
                    touchStartY = event.touches[0].clientY; // Enregistre la position de départ du toucher
                });

                // Gestion de la mise en pause du défilement
                window.addEventListener('touchmove', function(event) {
                    let touchMoveY = event.touches[0].clientY; // Récupère la position actuelle du toucher
                    let deltaY = touchMoveY - touchStartY; // Calcule le déplacement en y

                    if (Math.abs(deltaY) > TOUCH_SENSITIVITY) { // Vérifie si le déplacement dépasse la sensibilité
                        isPaused = true; // Met en pause le défilement
                    }
                });
            }
        }

        // Fonction pour démarrer le défilement au clic
        function startAutoScrollOnClick() {
            startAutoScroll(); // Démarre le défilement automatique
            isPaused = false; // Réinitialiser l'état de la pause
        }

        // Ajout de l'événement de démarrage du défilement automatique aux boutons
        document.getElementById('acceptButton').addEventListener('click', startAutoScrollOnClick);
        document.getElementById('rejectButton').addEventListener('click', startAutoScrollOnClick);

		// Fonction pour démarrer le défilement automatique
		//window.onload = function() {
		//	setTimeout(startAutoScroll, 0); // Délai de 0 secondes avant de démarrer le défilement automatique
		//};



/* autoView */

	// autoView /videoPlayer01

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer01 = document.getElementById('videoPlayer01');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid01.mp4' },
				//{ src: 'videos/.mp4', poster: 'images/.jpg' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				//if (index < videos.length) {
					videoPlayer01.src = videos[index].src;
					//videoPlayer01.poster = videos[index].poster;
					videoPlayer01.load();
					videoPlayer01.play();
				//}
			}

			//// Écouteur d'événement pour la fin de la vidéo
			//videoPlayer01.addEventListener('ended', function() {
			//	currentVideoIndex++;
			//	if (currentVideoIndex < videos.length) {
			//		loadVideo(currentVideoIndex);
			//	} else {
			//		// Réinitialiser à la première vidéo si toutes les vidéos sont jouées
			//		currentVideoIndex = 0;
			//		loadVideo(currentVideoIndex);
			//	}
			//});

			// Charger la première vidéo
			loadVideo(currentVideoIndex);
		});

	// autoView /videoPlayer02

		// Fonction pour passer à la video suivante
		document.addEventListener('DOMContentLoaded', function() {
			var videoPlayer02 = document.getElementById('videoPlayer02');

			// Liste des vidéos
			var videos = [
				{ src: 'videos/vid02.mp4' },
				{ src: 'videos/vid03.mp4' },
				//{ src: 'videos/.mp4', poster: 'images/.jpg' },
			];

			var currentVideoIndex = 0;

			// Fonction pour charger une vidéo
			function loadVideo(index) {
				if (index < videos.length) {
					videoPlayer02.src = videos[index].src;
					//videoPlayer02.poster = videos[index].poster;
					videoPlayer02.load();
					videoPlayer02.play();
				}
			}

			// Écouteur d'événement pour la fin de la vidéo
			videoPlayer02.addEventListener('ended', function() {
				currentVideoIndex++;
				if (currentVideoIndex < videos.length) {
					loadVideo(currentVideoIndex);
				} else {
					// Réinitialiser à la première vidéo si toutes les vidéos sont jouées
					currentVideoIndex = 0;
					loadVideo(currentVideoIndex);
				}
			});

			// Charger la première vidéo
			loadVideo(currentVideoIndex);
		});