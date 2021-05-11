<template>
  <div>
    <div ref="container" id="container"></div>
    <input type="file" accept="text/plain" @change="loadTextFromFile" />
  </div>
</template>

<script>
import * as THREE from "three/build/three.module";
import Stats from "three/examples/jsm/libs/stats.module";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  data() {
    return {
      /* 相机、场景、灯光、渲染 */
      camera: null,
      scene: null,
      light1: null,
      light2: null,
      renderer: null,
      /* Stats状态监测 */
      stats: null,
      /* 网格模型、几何体geometry表示（x1,y1,z1）的球体，geometry2表示(x2,y2,z2)、材质对象 */
      mesh: null,
      mesh2: null,
      geometry: null,
      geometry2: null,
      material: null,
      material2: null,
      /* 鼠标控件 */
      mouse: null,
      controls: null,
      /* 线 */
      line: null,
      line2: null,
      //文本读取后处理 数组结果
      Testresult: [],
      // x1 y1 z1
      x1arr: [],
      y1arr: [],
      z1arr: [],
      // x2 y2 z2
      x2arr: [],
      y2arr: [],
      z2arr: [],
      // 下标为1取点
      x1point: null,
      y1point: null,
      z1point: null,
      // 下标为2取点
      x2point: null,
      y2point: null,
      z2point: null,
    };
  },
  methods: {
    /*  读取文件方法 */
    loadTextFromFile: function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.$emit("load", this.dealNum(e.target.result));
      reader.readAsText(file);
    },

    /* 
    将文档读取到的数据转换为数组 
    遍历出x1arr，y1arr，z1arr
    */
    dealNum(item) {
      let resultArr = item.replace(/\r\n/g, " ").split(" ");
      this.Testresult = resultArr;
      /* x1 y1 z1 x2 y2 z2*/
      for (
        let m = 0, n = 2, k = 4, q = 1, r = 3, f = 5;
        m < this.Testresult.length,
          n < this.Testresult.length,
          k < this.Testresult.length,
          q < this.Testresult.length,
          r < this.Testresult.length,
          f < this.Testresult.length;
        m += 6, n += 6, k += 6, q += 6, r += 6, f += 6
      ) {
        this.z1arr.push(this.Testresult[k]);
        this.y1arr.push(this.Testresult[n]);
        this.x1arr.push(this.Testresult[m]);
        this.x2arr.push(this.Testresult[f]);
        this.y2arr.push(this.Testresult[r]);
        this.z2arr.push(this.Testresult[q]);
      }
      // 绘制坐标点下标为1的球体
      this.initObject();
      // 绘制坐标点下标为1球体的连接线
      this.initLine();
      // 绘制坐标点下标为2的球体
      this.initObject2();
      // 绘制坐标点下标为2球体的连接线
      this.initLine2();
    },
    //绘制（x1,y1,z1）的球体
    initObject() {
      /* IcosahedronGeometry二十面体
      几何体创建,二十面以上的多面体，当第二个参数大于1时为球体
      SphereGeometry球体 
      材质对象
      */
      this.geometry = new THREE.SphereGeometry(0.2, 32, 32);
      this.material = new THREE.MeshPhongMaterial();
      this.mesh = new THREE.InstancedMesh(this.geometry, this.material, 60);
      // 创建四维矩阵  把矩阵应用到三维向量
      let matrix1 = new THREE.Matrix4();
      let color = new THREE.Color();
      for (let z = 0; z < this.x1arr.length; z++) {
        this.x1point = this.x1arr[z] / window.innerWidth + z;
        this.y1point = this.y1arr[z] / window.innerHeight + z;
        this.z1point = this.z1arr[z] / 1000;
        matrix1.setPosition(this.x1point, this.y1point, this.z1point);
        this.mesh.setMatrixAt(z, matrix1);
        this.mesh.setColorAt(z, color);
      }
      this.scene.add(this.mesh);
    },
    //绘制（x1,y1,z1）球体的连线
    initLine() {
      /* 
      线条材质
       */
      const materialine = new THREE.LineBasicMaterial({ color: 0x0000ff });
      const points = [];
      for (let u = 0; u < this.x1arr.length; u++) {
        points.push(new THREE.Vector3(this.x1arr[u] / window.innerWidth + u,this.y1arr[u] / window.innerHeight + u,this.z1arr[u] / 1000));
      } 
      const geometryline = new THREE.BufferGeometry().setFromPoints(points);
      this.line = new THREE.Line(geometryline, materialine);
      this.scene.add(this.line);
    },
    // 绘制(x2,y2,z2)的球体
    initObject2() { 
      /* 
      SphereGeometry球体 
      材质对象
      */
      this.geometry2 = new THREE.SphereGeometry(0.3, 24, 24);
      this.material2 = new THREE.MeshPhongMaterial();
      this.mesh2 = new THREE.InstancedMesh(this.geometry2, this.material2, 30);
      // 创建四维矩阵  把矩阵应用到三维向量
      let matrix2 = new THREE.Matrix4();
      let color2 = new THREE.Color();
      for (let j = 0; j < this.x2arr.length; j++) {
        this.x2point = this.x2arr[j] / window.innerWidth + j;
        this.y2point = this.y2arr[j] / window.innerHeight + j;
        this.z2point = this.z2arr[j] / 1000;
        matrix2.setPosition(this.x2point, this.y2point, this.z2point);
        this.mesh2.setMatrixAt(j, matrix2);
        this.mesh2.setColorAt(j, color2);
      }
      this.scene.add(this.mesh2);
    },
    // 绘制(x2,y2,z2)球体的连线
    initLine2() {
      /* 
      线条材质
       */
      const materialine2 = new THREE.LineBasicMaterial({ color: 0x9966ff });
      const points2 = [];
      for (let v = 0; v < this.x2arr.length; v++) {
        points2.push(
          new THREE.Vector3(
            this.x2arr[v] / window.innerWidth + v,
            this.y2arr[v] / window.innerHeight + v,
            this.z2arr[v] / 1000
          )
        );
      }
      const geometryline2 = new THREE.BufferGeometry().setFromPoints(points2);
      this.line2 = new THREE.Line(geometryline2, materialine2);
      this.scene.add(this.line2);
    },

    init: function () {
      /* 
      场景设置
      场景背景色设置
      */
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x33dd99);//

      /* PerspectiveCamera透视相机
      param1 视角即可以看到的角度范围，人的视场大约是180度，一般游戏的视场为60度到90度，推荐默认值45
      param2 长宽比决定了水平视角和垂直视角之间的比例关系
      param3 基于相机位置，表示从这里开始渲染场景；一般会设置一个很小的值，推荐默认值0.1
      param4 基于相机位置，表示停止渲染的位置；要注意设置合适的距离，如果设置太小，部分场景可能渲染不到，但如果设置的太大，会影响渲染的效率，默认值1000
      */
      this.camera = new THREE.PerspectiveCamera(90,window.innerWidth / window.innerHeight,0.1,1000);
      this.camera.position.set(20, 20, 20);

      /*  灯光 
      HemisphereLight半球光：光照颜色从天空光线颜色渐变到地面光线颜色
      position.set假如这个值设置等于 Object3D.DefaultUp (0, 1, 0),那么光线将会从上往下照射
      */
      this.light1 = new THREE.HemisphereLight(0xffffff, 0x111188);
      this.light1.position.set(-1, 1, 1);
      this.light2 = new THREE.HemisphereLight(0xbb2233, 0x080820, 0.5);
      this.light2.position.set(-1, -1.5, -1);

      /* 
      将灯光添加至场景中
      */
      this.scene.add(this.light1, this.light2);

      /* WebGLRenderer渲染引擎
      antialias 是否开启锯齿 默认false
      setSize 将输出canvas的大小调整为(width, height)并考虑设备像素比，且将视口从(0, 0)开始调整到适合大小
      setPixelRatio 设置设备像素比
      */
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      /* 
      this.renderer.domElement显示成hcanvas画布输出在界面上
      stats 表示当前场景的渲染帧率和显存占用情况
      */
      this.$refs.container.appendChild(this.renderer.domElement);
      this.stats = new Stats();
      this.$refs.container.appendChild(this.stats.dom);
      window.addEventListener("resize", this.onWindowResize);
      this.$refs.container.addEventListener("mousemove", this.onMouseMove);
    },
    onWindowResize: function () {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    onMouseMove: function (event) {
      event.preventDefault();
      this.mouse = new THREE.Vector2(1, 1);
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },

    /**
    创建控件对象（鼠标控制）
    使动画循环使用时阻尼或自转 意思是否有惯性
    是否可以缩放
    是否开启右键拖拽
    */
    initControls: function () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.enableZoom = true;
      this.controls.enablePan = true;
    },

    /*  
    执行渲染操作 
    */
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.stats.update();
      this.render();
    },
  },
  mounted() {
    this.init();
    this.animate();
    this.initControls();
  },
};
</script>

<style>
#container {
  width: 100%;
  height: 100vh;
}
</style>