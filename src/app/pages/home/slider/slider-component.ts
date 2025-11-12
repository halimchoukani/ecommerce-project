import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Image {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-component.html',
  styleUrls: ['./slider-component.scss'],
})
export class SliderComponent implements OnInit, OnDestroy {

  images: Image[] = [
    { src: 'assets/img/img-pub1.jpg', alt: 'Parfum 1' },
    { src: 'assets/img/img-pub2.jpg', alt: 'Parfum 2' },
    { src: 'assets/img/img-pub3.jpg', alt: 'Parfum 3' }
  ];

  carouselImages: Image[] = [];

  currentIndex = 1;
  isTransitioning = true;

  autoSlideInterval: any;

  ngOnInit() {
    this.carouselImages = [
      this.images[this.images.length - 1], 
      ...this.images,
      this.images[0] 
    ];

    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  nextSlide() {
    if (this.currentIndex >= this.carouselImages.length - 1) return;
    this.currentIndex++;
    this.isTransitioning = true;

    setTimeout(() => {
      if (this.currentIndex === this.carouselImages.length - 1) {
        this.isTransitioning = false;
        this.currentIndex = 1;
      }
    }, 800);
  }

  prevSlide() {
    if (this.currentIndex <= 0) return;
    this.currentIndex--;
    this.isTransitioning = true;

    setTimeout(() => {
      if (this.currentIndex === 0) {
        this.isTransitioning = false;
        this.currentIndex = this.carouselImages.length - 2;
      }
    }, 800);
  }

  goToSlide(index: number) {
    this.currentIndex = index + 1;
    this.isTransitioning = true;
  }

}
