import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import styles from './ParticleBackground.module.css';

function Embers({ count = 2000 }) {
  const points = useRef<THREE.Points>(null);
  
  // Generate random positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = Math.random() * 0.02 + 0.005; // Flow upwards
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const posArray = points.current.geometry.attributes.position.array as Float32Array;
    
    // Slight sway based on time
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions
      posArray[i3] += velocities[i3] + Math.sin(time * 0.5 + posArray[i3+1]) * 0.002;
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Reset if out of bounds (wrapping around)
      if (posArray[i3 + 1] > 7.5) {
        posArray[i3 + 1] = -7.5;
        posArray[i3] = (Math.random() - 0.5) * 15;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation
    points.current.rotation.y = time * 0.05;
    points.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6c63ff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ParticleBackground() {
  return (
    <div className={styles.canvasContainer}>
      <div className={styles.overlayGradient} />
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <Embers count={3000} />
      </Canvas>
    </div>
  );
}
