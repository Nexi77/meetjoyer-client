<template>
    <div class="loader-zone">
        <span class="loader" />
    </div>
</template>

<style scoped>
.loader-zone {
    display: flex;
    flex-grow: 1;
    width: 100%;
    justify-content: center;

}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: var(--white-400) var(--white-400) transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loader::after,
.loader::before{
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent var(--asset-400) var(--asset-400);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}

.loader::before {
  width: 32px;
  height: 32px;
  border-color: var(--white-400) var(--white-400) transparent transparent;
  animation: rotation 1.5s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* stylelint-disable-next-line keyframes-name-pattern */
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>
