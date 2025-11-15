from django.core.management.base import BaseCommand
from api.models import Project


class Command(BaseCommand):
    help = 'Очищает все проекты и информацию о деплое из базы данных'

    def add_arguments(self, parser):
        parser.add_argument(
            '--deploy-only',
            action='store_true',
            help='Очистить только информацию о деплое (deployed_url, deployed_at), но оставить проекты',
        )

    def handle(self, *args, **options):
        if options['deploy_only']:
            # Очищаем только информацию о деплое
            projects_updated = Project.objects.filter(
                deployed_url__isnull=False
            ).update(
                deployed_url=None,
                deployed_at=None
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Очищена информация о деплое для {projects_updated} проектов'
                )
            )
        else:
            # Удаляем все проекты
            count = Project.objects.count()
            Project.objects.all().delete()
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Удалено {count} проектов из базы данных'
                )
            )



