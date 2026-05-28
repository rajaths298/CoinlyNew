import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import { appColors as colors } from '../theme';
import type { LemonadeSession, StationId } from '../types/game';

type Props = {
  session: LemonadeSession;
  customerCount: number;
  onStationPress: (stationId: StationId) => void;
};

const stationLabels: Record<StationId, string> = {
  shelf: 'Stock',
  pitcher: 'Mix',
  register: 'Pay',
  counter: 'Serve',
  cleaning: 'Clean',
};

type ThreeState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animated: THREE.Object3D[];
  frameId?: number;
};

export default function LemonadeShop3D({ session, customerCount, onStationPress }: Props) {
  const threeRef = useRef<ThreeState | null>(null);
  const sessionRef = useRef(session);
  const customerCountRef = useRef(customerCount);
  const [renderMode, setRenderMode] = useState<'gl' | 'fallback'>('fallback');

  useEffect(() => {
    sessionRef.current = session;
    customerCountRef.current = customerCount;
    updateSceneFromSession(threeRef.current, session, customerCount);
  }, [session, customerCount]);

  useEffect(() => () => {
    if (threeRef.current?.frameId) cancelAnimationFrame(threeRef.current.frameId);
    threeRef.current?.renderer.dispose();
    threeRef.current = null;
  }, []);

  const visibleCustomerCount = Math.max(customerCount, session.inventory > 0 ? 1 : 0);

  return (
    <View style={styles.wrap}>
      {renderMode === 'gl' ? (
        <GLView
          style={styles.gl}
          onContextCreate={(gl) => {
            try {
              threeRef.current = createScene(gl);
              updateSceneFromSession(threeRef.current, sessionRef.current, customerCountRef.current);
            } catch (error) {
              console.warn('Lemonade 3D renderer failed; using fallback scene.', error);
              if (threeRef.current?.frameId) cancelAnimationFrame(threeRef.current.frameId);
              threeRef.current?.renderer.dispose();
              threeRef.current = null;
              setRenderMode('fallback');
            }
          }}
        />
      ) : (
        <FallbackShopScene session={session} customerCount={visibleCustomerCount} />
      )}
      {renderMode === 'gl' ? (
        <View pointerEvents="none" style={styles.queuePreview}>
          {Array.from({ length: visibleCustomerCount }).slice(0, 5).map((_, index) => (
            <View key={index} style={[styles.queuePreviewCustomer, { right: `${8 + index * 12}%`, bottom: `${9 + index * 4}%` }]}>
              <View style={styles.queuePreviewHead} />
              <View style={styles.queuePreviewBody} />
            </View>
          ))}
        </View>
      ) : null}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <StationHitbox id="shelf" left="5%" top="18%" width="26%" height="33%" onPress={onStationPress} />
        <StationHitbox id="pitcher" left="34%" top="38%" width="19%" height="26%" onPress={onStationPress} />
        <StationHitbox id="register" left="55%" top="42%" width="19%" height="22%" onPress={onStationPress} />
        <StationHitbox id="counter" left="22%" top="58%" width="54%" height="22%" onPress={onStationPress} />
        <StationHitbox id="cleaning" left="75%" top="40%" width="20%" height="22%" onPress={onStationPress} />
      </View>
    </View>
  );
}

function FallbackShopScene({ session, customerCount }: { session: LemonadeSession; customerCount: number }) {
  return (
    <View style={styles.fallbackScene}>
      <View style={styles.fallbackBackWall}>
        <View style={[styles.fallbackSign, (session.ownedUpgrades.sign ?? 0) > 0 && styles.fallbackSignUpgraded]}>
          <Text style={styles.fallbackSignText}>LEMONADE</Text>
        </View>
        <View style={styles.fallbackWindow} />
        <View style={styles.fallbackMenu}>
          <Text style={styles.fallbackMenuTitle}>MENU</Text>
          <Text style={styles.fallbackMenuLine}>Classic ${session.recipe.price}</Text>
        </View>
      </View>
      <View style={styles.fallbackShelf}>
        {[0, 1, 2, 3, 4, 5].map((item) => <View key={item} style={styles.fallbackJar} />)}
      </View>
      <View style={styles.fallbackPitcher} />
      <View style={styles.fallbackRegister} />
      <View style={styles.fallbackCounter}>
        {[0, 1, 2].map((cup) => <View key={cup} style={styles.fallbackCup} />)}
      </View>
      <View style={styles.fallbackSink} />
      {session.workers.length > 0 ? (
        <View style={styles.fallbackWorker}>
          <Text style={styles.workerTag}>STAFF</Text>
          <View style={styles.fallbackWorkerHead} />
          <View style={styles.fallbackWorkerBody} />
        </View>
      ) : null}
    </View>
  );
}

function StationHitbox({
  id,
  left,
  top,
  width,
  height,
  onPress,
}: {
  id: StationId;
  left: `${number}%`;
  top: `${number}%`;
  width: `${number}%`;
  height: `${number}%`;
  onPress: (stationId: StationId) => void;
}) {
  return (
    <View
      onTouchEnd={() => onPress(id)}
      style={[styles.hitbox, { left, top, width, height }]}
    >
      <Text style={styles.hitboxLabel}>{stationLabels[id]}</Text>
    </View>
  );
}

function createScene(gl: ExpoWebGLRenderingContext): ThreeState {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#9DD7F2');
  const camera = new THREE.PerspectiveCamera(48, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100);
  camera.position.set(6.2, 5.6, 8.4);
  camera.lookAt(0, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: {
      width: gl.drawingBufferWidth,
      height: gl.drawingBufferHeight,
      style: {},
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      clientHeight: gl.drawingBufferHeight,
      clientWidth: gl.drawingBufferWidth,
      getContext: () => gl,
    } as unknown as HTMLCanvasElement,
    context: gl as unknown as WebGLRenderingContext,
  });
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight, false);
  renderer.setPixelRatio(1);

  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  const sun = new THREE.DirectionalLight(0xffffff, 1.05);
  sun.position.set(4, 7, 5);
  scene.add(sun);

  const animated: THREE.Object3D[] = [];
  buildShop(scene, animated);

  const state: ThreeState = { renderer, scene, camera, animated };
  const render = () => {
    const time = Date.now() * 0.001;
    animated.forEach((object, index) => {
      object.position.y += Math.sin(time * 2 + index) * 0.0018;
      object.rotation.y += 0.006;
    });
    renderer.render(scene, camera);
    gl.endFrameEXP();
    state.frameId = requestAnimationFrame(render);
  };
  render();
  return state;
}

function buildShop(scene: THREE.Scene, animated: THREE.Object3D[]) {
  const floor = box(8.8, 0.18, 6.2, '#6FC16E');
  floor.position.set(0, -0.1, 0);
  scene.add(floor);

  const tileA = box(1.9, 0.035, 1.25, '#7CD479');
  tileA.position.set(-2.6, 0.02, 0.35);
  scene.add(tileA);
  const tileB = box(1.9, 0.035, 1.25, '#5FB95C');
  tileB.position.set(0, 0.025, 0.35);
  scene.add(tileB);
  const tileC = box(1.9, 0.035, 1.25, '#7CD479');
  tileC.position.set(2.6, 0.02, 0.35);
  scene.add(tileC);

  const backWall = box(8.8, 3.4, 0.18, '#F4F0DF');
  backWall.position.set(0, 1.6, -2.9);
  scene.add(backWall);

  const leftWall = box(0.18, 3.2, 6, '#E3D8AC');
  leftWall.position.set(-4.4, 1.5, 0);
  scene.add(leftWall);

  const serviceWindow = box(3.2, 1.1, 0.08, '#9DD7F2');
  serviceWindow.position.set(1.7, 1.85, -2.78);
  scene.add(serviceWindow);

  const menuBoard = box(1.6, 1.0, 0.1, '#10241D');
  menuBoard.position.set(-2.5, 1.95, -2.72);
  scene.add(menuBoard);
  const menuLine1 = box(1.1, 0.08, 0.12, colors.yellow);
  menuLine1.position.set(-2.5, 2.15, -2.62);
  scene.add(menuLine1);
  const menuLine2 = box(0.9, 0.08, 0.12, colors.white);
  menuLine2.position.set(-2.5, 1.9, -2.62);
  scene.add(menuLine2);
  const menuLine3 = box(0.7, 0.08, 0.12, colors.white);
  menuLine3.position.set(-2.5, 1.67, -2.62);
  scene.add(menuLine3);

  const counter = box(5.4, 0.9, 0.8, '#8B5A2B');
  counter.position.set(0, 0.45, 1.35);
  scene.add(counter);

  const counterTop = box(5.55, 0.12, 0.92, '#DFAF3F');
  counterTop.position.set(0, 0.98, 1.35);
  scene.add(counterTop);

  const awning = box(5.8, 0.22, 1.1, colors.yellow);
  awning.position.set(0, 1.15, 1.28);
  scene.add(awning);

  const pitcher = cylinder(0.38, 0.95, '#F8E27A');
  pitcher.position.set(-0.8, 1.18, 1.1);
  pitcher.name = 'pitcher';
  animated.push(pitcher);
  scene.add(pitcher);

  const register = box(0.85, 0.48, 0.62, '#10241D');
  register.position.set(2.1, 1.08, 1.05);
  register.name = 'register';
  scene.add(register);

  const registerScreen = box(0.46, 0.2, 0.08, colors.yellow);
  registerScreen.position.set(2.1, 1.35, 0.76);
  scene.add(registerScreen);

  const shelf = box(1.3, 2.35, 0.58, '#B57A42');
  shelf.position.set(-3.25, 1.08, -1.35);
  shelf.name = 'shelf';
  scene.add(shelf);
  for (let shelfLine = 0; shelfLine < 3; shelfLine += 1) {
    const shelfBoard = box(1.18, 0.08, 0.64, '#6D421F');
    shelfBoard.position.set(-3.25, 0.45 + shelfLine * 0.58, -1.32);
    scene.add(shelfBoard);
  }
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const ingredient = cylinder(0.12, 0.32, row === 0 ? colors.yellow : row === 1 ? '#FFFFFF' : '#9DD7F2');
      ingredient.position.set(-3.55 + col * 0.3, 0.45 + row * 0.58, -0.98);
      animated.push(ingredient);
      scene.add(ingredient);
    }
  }

  const sink = box(1.0, 0.35, 0.72, '#A7C7E7');
  sink.position.set(3.2, 0.76, -1.25);
  sink.name = 'cleaning';
  scene.add(sink);

  const mop = cylinder(0.04, 1.08, '#10241D');
  mop.position.set(3.78, 0.76, -1.55);
  mop.rotation.z = 0.35;
  scene.add(mop);
  const mopHead = box(0.42, 0.12, 0.2, colors.yellow);
  mopHead.position.set(3.95, 0.25, -1.72);
  scene.add(mopHead);

  const queueLine = box(0.08, 0.04, 3.1, '#10241D');
  queueLine.position.set(2.85, 0.05, 0.15);
  scene.add(queueLine);

  for (let i = 0; i < 5; i += 1) {
    const cup = cylinder(0.11, 0.28, '#FFFDF4');
    cup.position.set(0.8 + i * 0.18, 1.1, 1.0);
    scene.add(cup);
  }

  const floorArrow = box(1.15, 0.04, 0.2, colors.yellow);
  floorArrow.position.set(2.6, 0.04, 1.2);
  scene.add(floorArrow);
  const queueMat = box(1.4, 0.04, 2.2, 'rgba(16,36,29,1)');
  queueMat.position.set(2.8, 0.03, -0.35);
  scene.add(queueMat);
}

function updateSceneFromSession(state: ThreeState | null, session: LemonadeSession, customerCount: number) {
  if (!state) return;
  const existing = state.scene.getObjectByName('dynamic-customers');
  if (existing) {
    state.scene.remove(existing);
    disposeObject(existing);
  }
  const group = new THREE.Group();
  group.name = 'dynamic-customers';
  for (let i = 0; i < customerCount; i += 1) {
    const customer = makeCustomerMesh(i);
    customer.position.set(3.05 - i * 0.55, 0.58, 1.05 - i * 0.58);
    group.add(customer);
  }
  state.scene.add(group);

  const sign = state.scene.getObjectByName('upgrade-sign');
  if (!sign && (session.ownedUpgrades.sign ?? 0) > 0) {
    const signMesh = box(2.2, 0.42, 0.12, colors.yellow);
    signMesh.position.set(0, 2.75, -2.75);
    signMesh.name = 'upgrade-sign';
    state.scene.add(signMesh);
  }
  const helper = state.scene.getObjectByName('worker-helper');
  if (!helper && session.workers.length > 0) {
    const workerMesh = makeWorkerMesh();
    workerMesh.position.set(-1.7, 0.72, 0.85);
    workerMesh.name = 'worker-helper';
    state.scene.add(workerMesh);
  }
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else if (material) {
      material.dispose();
    }
  });
}

function makeCustomerMesh(index: number) {
  const group = new THREE.Group();
  const body = box(0.28, 0.48, 0.2, ['#F79D84', '#84DCC6', '#A7C7E7', '#CDB4DB'][index % 4]);
  body.position.y = 0.18;
  const head = sphere(0.18, '#F7B267');
  head.position.y = 0.55;
  group.add(body, head);
  return group;
}

function makeWorkerMesh() {
  const group = new THREE.Group();
  const body = box(0.34, 0.55, 0.24, colors.yellow);
  body.position.y = 0.2;
  const head = sphere(0.18, '#F7B267');
  head.position.y = 0.58;
  group.add(body, head);
  return group;
}

function box(width: number, height: number, depth: number, color: string) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.72 });
  return new THREE.Mesh(geometry, material);
}

function cylinder(radius: number, height: number, color: string) {
  const geometry = new THREE.CylinderGeometry(radius, radius * 0.86, height, 16);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.64 });
  return new THREE.Mesh(geometry, material);
}

function sphere(radius: number, color: string) {
  const geometry = new THREE.SphereGeometry(radius, 16, 12);
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  return new THREE.Mesh(geometry, material);
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#9DD7F2',
  },
  gl: {
    flex: 1,
  },
  hitbox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  hitboxLabel: {
    marginTop: 2,
    overflow: 'hidden',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    color: colors.yellow,
    backgroundColor: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 12,
  },
  fallbackScene: {
    flex: 1,
    backgroundColor: '#74C96B',
    overflow: 'hidden',
  },
  fallbackBackWall: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '42%',
    backgroundColor: '#F4F0DF',
    borderBottomWidth: 3,
    borderBottomColor: colors.black,
  },
  fallbackWindow: {
    position: 'absolute',
    left: '30%',
    top: 50,
    width: '32%',
    height: 48,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: '#9DD7F2',
  },
  fallbackMenu: {
    position: 'absolute',
    right: '5%',
    top: 46,
    width: '22%',
    minHeight: 56,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: colors.black,
    padding: 7,
  },
  fallbackMenuTitle: {
    color: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 18,
  },
  fallbackMenuLine: {
    marginTop: 4,
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  fallbackSign: {
    position: 'absolute',
    top: 22,
    alignSelf: 'center',
    minWidth: 150,
    minHeight: 38,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackSignUpgraded: {
    backgroundColor: colors.yellow,
  },
  fallbackSignText: {
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
  },
  fallbackShelf: {
    position: 'absolute',
    left: '5%',
    top: '19%',
    width: '24%',
    height: '33%',
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: '#B57A42',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 9,
  },
  fallbackJar: {
    width: 18,
    height: 27,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.yellow,
  },
  fallbackCounter: {
    position: 'absolute',
    left: '22%',
    right: '22%',
    top: '59%',
    height: '20%',
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: '#8B5A2B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackPitcher: {
    position: 'absolute',
    left: '36%',
    top: '40%',
    width: 38,
    height: 56,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 12,
    backgroundColor: '#F8E27A',
  },
  fallbackRegister: {
    position: 'absolute',
    left: '57%',
    top: '44%',
    width: 46,
    height: 36,
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: colors.black,
  },
  fallbackCup: {
    width: 18,
    height: 28,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  fallbackSink: {
    position: 'absolute',
    left: '76%',
    top: '40%',
    width: '18%',
    height: '21%',
    borderWidth: 3,
    borderColor: colors.black,
    borderRadius: 8,
    backgroundColor: '#A7C7E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackQueueMat: {
    position: 'absolute',
    right: '8%',
    bottom: '7%',
    width: '44%',
    height: '20%',
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 10,
    backgroundColor: 'rgba(245,193,66,0.34)',
  },
  queueLabel: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    color: colors.black,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 16,
  },
  fallbackCustomer: {
    position: 'absolute',
    alignItems: 'center',
  },
  fallbackCustomerHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: '#F7B267',
  },
  fallbackCustomerBody: {
    marginTop: -2,
    width: 30,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: '#A7C7E7',
  },
  fallbackWorker: {
    position: 'absolute',
    left: '40%',
    bottom: '22%',
    alignItems: 'center',
  },
  workerTag: {
    marginBottom: 2,
    overflow: 'hidden',
    borderRadius: 10,
    paddingHorizontal: 7,
    color: colors.black,
    backgroundColor: colors.yellow,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 12,
  },
  fallbackWorkerHead: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: '#F7B267',
  },
  fallbackWorkerBody: {
    marginTop: -2,
    width: 36,
    height: 46,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.yellow,
  },
  queuePreview: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  queuePreviewCustomer: {
    position: 'absolute',
    alignItems: 'center',
  },
  queuePreviewHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: '#F7B267',
  },
  queuePreviewBody: {
    marginTop: -2,
    width: 30,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: '#A7C7E7',
  },
});
