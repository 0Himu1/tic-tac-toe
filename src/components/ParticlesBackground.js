import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground = () => {
	const particlesInit = useCallback(async engine => {
		await loadSlim(engine);
	}, []);

	return (
		<Particles
			id="tsparticles"
			init={particlesInit}
			options={{
				background: {
					color: {
						value: 'transparent',
					},
				},
				fpsLimit: 60,
				interactivity: {
					events: {
						onClick: {
							enable: true,
							mode: 'push',
						},
						onHover: {
							enable: true,
							mode: 'repulse',
						},
						resize: true,
					},
					modes: {
						push: {
							quantity: 2,
						},
						repulse: {
							distance: 100,
							duration: 0.4,
						},
					},
				},
				particles: {
					color: {
						value: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'],
					},
					links: {
						color: '#ffffff',
						distance: 150,
						enable: true,
						opacity: 0.3,
						width: 1,
					},
					move: {
						direction: 'none',
						enable: true,
						outModes: {
							default: 'bounce',
						},
						random: false,
						speed: 1.5,
						straight: false,
					},
					number: {
						density: {
							enable: true,
							area: 800,
						},
						value: 60,
					},
					opacity: {
						value: 0.5,
					},
					shape: {
						type: ['circle', 'triangle', 'square'],
					},
					size: {
						value: { min: 1, max: 4 },
					},
				},
				detectRetina: true,
			}}
		/>
	);
};

export default ParticlesBackground;
